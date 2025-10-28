import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/core';
import { TopContributingRepo, RateLimit, Repo } from '@/types/repo';
import { env } from '@/config/env';

const octokit = new Octokit({
	auth: env.GITHUB_TOKEN,
});

// In-memory cache
const cache = new Map<
	string,
	{
		data: { repoActivities: TopContributingRepo[]; rateLimit: RateLimit };
		expiration: number;
	}
>();

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const username = searchParams.get('username');

	if (!username) {
		return NextResponse.json(
			{ error: 'Username is required' },
			{ status: 400 },
		);
	}

	const cacheKey = `top_contributing_${username}`;
	const cachedData = cache.get(cacheKey);

	// Check if data is in cache and not expired
	if (cachedData && cachedData.expiration > Date.now()) {
		return NextResponse.json(cachedData.data);
	}

	try {
		// Define GraphQL response type
		type ReposGraphQLResponse = {
			user: {
				repositories: {
					nodes: Array<{
						name: string;
						owner: {
							login: string;
						};
						isFork: boolean;
						parent?: {
							name: string;
							owner: {
								login: string;
							};
						};
					}>;
					pageInfo: {
						hasNextPage: boolean;
						endCursor: string | null;
					};
				};
			};
			rateLimit: {
				limit: number;
				remaining: number;
				used: number;
				resetAt: string;
			};
		};

		// Fetch ALL user's repositories using GraphQL with pagination
		let allRepos: Array<{
			name: string;
			owner: {
				login: string;
			};
			isFork: boolean;
			parent?: {
				name: string;
				owner: {
					login: string;
				};
			};
		}> = [];

		let hasNextPage = true;
		let cursor: string | null = null;
		const perPage = 100;
		let lastResponse: ReposGraphQLResponse | null = null;

		while (hasNextPage) {
			const response: ReposGraphQLResponse =
				await octokit.graphql<ReposGraphQLResponse>(
					`
				query($username: String!, $first: Int!, $after: String) {
					user(login: $username) {
						repositories(first: $first, after: $after, ownerAffiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]) {
							nodes {
								name
								owner {
									login
								}
								isFork
								parent {
									name
									owner {
										login
									}
								}
							}
							pageInfo {
								hasNextPage
								endCursor
							}
						}
					}
					rateLimit {
						limit
						remaining
						used
						resetAt
					}
				}
			`,
					{
						username: username,
						first: perPage,
						after: cursor,
					},
				);

			allRepos = allRepos.concat(response.user.repositories.nodes);
			hasNextPage = response.user.repositories.pageInfo.hasNextPage;
			cursor = response.user.repositories.pageInfo.endCursor;
			lastResponse = response;

			// Safety check to prevent infinite loops
			if (allRepos.length > 1000) {
				break;
			}
		}

		// Get accurate commit counts using Link header pagination trick
		// Query with per_page=1 and extract the last page number from Link header
		// This gives us the exact TOTAL commit count (all contributors) with minimal data transfer
		// Reference: https://gist.github.com/0penBrain/7be59a48aba778c955d992aa69e524c5

		const BATCH_SIZE = 15; // Process 15 repos at a time
		const repoActivities: TopContributingRepo[] = [];

		for (let i = 0; i < allRepos.length; i += BATCH_SIZE) {
			const batch = allRepos.slice(i, i + BATCH_SIZE);
			const batchResults = await Promise.all(
				batch.map(async (repo) => {
					// If it's a fork, treat it as not owned by user and count commits in the fork
					// Otherwise, check if the owner matches the username
					const isFork = repo.isFork && repo.parent;
					const isOwnedByUser =
						!isFork &&
						repo.owner.login.toLowerCase() === username.toLowerCase();

					try {
						// For forks, we want to count commits in the original repo (parent)
						// For owned repos, count in the user's repo
						const targetOwner =
							isFork && repo.parent
								? repo.parent.owner.login
								: repo.owner.login;
						const targetRepo =
							isFork && repo.parent ? repo.parent.name : repo.name;

						// Query commits with per_page=1 to minimize data transfer
						// The Link header will tell us the total page count = total commits
						// No author filter - we want ALL commits in the repo
						const response = await octokit.request(
							'GET /repos/{owner}/{repo}/commits',
							{
								owner: targetOwner,
								repo: targetRepo,
								// No author filter - count all commits
								per_page: 1, // Only fetch 1 commit to get pagination info
								headers: {
									'X-GitHub-Api-Version': '2022-11-28',
								},
							},
						);

						// Parse the Link header to get the last page number
						const linkHeader = response.headers.link;
						let totalCommits = 0;

						if (!linkHeader) {
							// No Link header means there's only 0 or 1 commit
							totalCommits = response.data.length;
						} else {
							// Extract last page number from Link header
							// Link header format: <url>; rel="next", <url>; rel="last"
							const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);

							if (lastPageMatch) {
								totalCommits = parseInt(lastPageMatch[1], 10);
							} else {
								// If no "last" link, check if there's a "next" link
								const nextPageMatch = linkHeader.match(
									/page=(\d+)>; rel="next"/,
								);
								if (nextPageMatch) {
									// If there's a next but no last, we're on first page with more pages
									totalCommits = parseInt(nextPageMatch[1], 10);
								} else {
									// Fallback to data length if we can't parse the header
									totalCommits = response.data.length;
								}
							}
						}

						// Always fetch the user's individual commit count, even for owned repos
						let userCommits: number | undefined = undefined;

						if (totalCommits > 0) {
							try {
								// Count user's commits using the author parameter with Link header pagination
								// Note: Matches git author name/email which usually corresponds to GitHub username
								const userResponse = await octokit.request(
									'GET /repos/{owner}/{repo}/commits',
									{
										owner: targetOwner,
										repo: targetRepo,
										author: username,
										per_page: 1,
										headers: {
											'X-GitHub-Api-Version': '2022-11-28',
										},
									},
								);

								const userLinkHeader = userResponse.headers.link;

								if (!userLinkHeader) {
									userCommits = userResponse.data.length;
								} else {
									const userLastPageMatch = userLinkHeader.match(
										/page=(\d+)>; rel="last"/,
									);
									if (userLastPageMatch) {
										userCommits = parseInt(userLastPageMatch[1], 10);
									} else {
										const userNextPageMatch = userLinkHeader.match(
											/page=(\d+)>; rel="next"/,
										);
										userCommits = userNextPageMatch
											? parseInt(userNextPageMatch[1], 10)
											: userResponse.data.length;
									}
								}
							} catch {
								// If we can't fetch user commits, set to undefined
								userCommits = undefined;
							}
						}

						// Use the target owner/repo name for display
						const displayOwner =
							isFork && repo.parent
								? repo.parent.owner.login
								: repo.owner.login;
						const displayRepo =
							isFork && repo.parent ? repo.parent.name : repo.name;

						return {
							repo: displayRepo,
							owner: displayOwner,
							totalCommits,
							userCommits,
							isOwnedByUser,
						};
					} catch (error) {
						// If repo is empty, private, or inaccessible, return 0
						const displayOwner =
							isFork && repo.parent
								? repo.parent.owner.login
								: repo.owner.login;
						const displayRepo =
							isFork && repo.parent ? repo.parent.name : repo.name;

						return {
							repo: displayRepo,
							owner: displayOwner,
							totalCommits: 0,
							isOwnedByUser: false,
						};
					}
				}),
			);

			repoActivities.push(...batchResults);
		}

		// Sort by commit count and filter out repos with 0 commits or where user has no commits
		const sortedActivities = repoActivities
			.filter((activity) => {
				// Must have total commits
				if (activity.totalCommits === 0) return false;
				// Must have user commits - exclude repos where user has 0 commits
				if (activity.userCommits === undefined || activity.userCommits === 0)
					return false;
				return true;
			})
			.sort((a, b) => b.totalCommits - a.totalCommits)
			.slice(0, 5); // Return top 5 as requested

		// Get rate limit from the last GraphQL response
		const rateLimit: RateLimit = lastResponse
			? {
					limit: lastResponse.rateLimit.limit,
					remaining: lastResponse.rateLimit.remaining,
					used: lastResponse.rateLimit.used,
					reset: new Date(lastResponse.rateLimit.resetAt).getTime() / 1000,
			  }
			: {
					limit: 5000,
					remaining: 5000,
					used: 0,
					reset: Date.now() / 1000 + 3600,
			  };

		const dataToCache = {
			repoActivities: sortedActivities,
			rateLimit,
		};

		// Store in cache with 2-hour expiration
		cache.set(cacheKey, {
			data: dataToCache,
			expiration: Date.now() + 7200000, // 2 hours
		});

		return NextResponse.json(dataToCache);
	} catch (error) {
		return NextResponse.json(
			{
				error: 'An error occurred while fetching top contributing repos',
				details: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
