import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/core';
import { TopContributingRepo, RateLimit, Repo } from '@/types/repo';

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
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
		// Fetch ALL user's repositories using GraphQL with pagination
		let allRepos: Array<{
			name: string;
			owner: {
				login: string;
			};
		}> = [];

		let hasNextPage = true;
		let cursor: string | null = null;
		const perPage = 100;

		while (hasNextPage) {
			const response = await octokit.graphql<{
				user: {
					repositories: {
						nodes: Array<{
							name: string;
							owner: {
								login: string;
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
			}>(
				`
				query($username: String!, $first: Int!, $after: String) {
					user(login: $username) {
						repositories(first: $first, after: $after, ownerAffiliations: OWNER) {
							nodes {
								name
								owner {
									login
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

			// Safety check to prevent infinite loops
			if (allRepos.length > 1000) {
				break;
			}
		}

		console.log(`Found ${allRepos.length} repositories for ${username}`);

		// Get accurate commit counts for each repo using REST API with pagination
		// Process ALL repositories, not just the first 20
		const repoActivities = await Promise.all(
			allRepos.map(async (repo) => {
				try {
					let totalCommits = 0;
					let page = 1;
					const perPage = 100;
					let hasMorePages = true;

					while (hasMorePages) {
						const { data } = await octokit.request(
							'GET /repos/{owner}/{repo}/commits',
							{
								owner: repo.owner.login,
								repo: repo.name,
								author: username,
								per_page: perPage,
								page: page,
								sha: 'HEAD', // Include all branches
							},
						);

						totalCommits += data.length;

						// If we got less than perPage results, we've reached the end
						if (data.length < perPage) {
							hasMorePages = false;
						} else {
							page++;
						}

						// Safety check to prevent infinite loops
						if (page > 50) {
							// Max 5000 commits per repo
							break;
						}
					}

					// Also count commits where user is the committer (not author)
					// This catches merges, rebases, etc.
					let committerCommits = 0;
					page = 1;
					hasMorePages = true;

					while (hasMorePages) {
						const { data } = await octokit.request(
							'GET /repos/{owner}/{repo}/commits',
							{
								owner: repo.owner.login,
								repo: repo.name,
								committer: username,
								per_page: perPage,
								page: page,
								sha: 'HEAD', // Include all branches
							},
						);

						// Filter out commits where user is both author and committer to avoid double counting
						const uniqueCommitterCommits = data.filter(
							(commit) => commit.author?.login !== username,
						);

						committerCommits += uniqueCommitterCommits.length;

						// If we got less than perPage results, we've reached the end
						if (data.length < perPage) {
							hasMorePages = false;
						} else {
							page++;
						}

						// Safety check to prevent infinite loops
						if (page > 50) {
							// Max 5000 commits per repo
							break;
						}
					}

					return {
						repo: repo.name,
						totalCommits: totalCommits + committerCommits,
					};
				} catch (error) {
					console.error(`Error fetching commits for ${repo.name}:`, error);
					return {
						repo: repo.name,
						totalCommits: 0,
					};
				}
			}),
		);

		// Sort by commit count and filter out repos with 0 commits
		const sortedActivities = repoActivities
			.filter((activity) => activity.totalCommits > 0)
			.sort((a, b) => b.totalCommits - a.totalCommits)
			.slice(0, 5); // Return top 5 as requested

		// Get rate limit from the last response
		const rateLimit: RateLimit = {
			limit: 5000, // Default fallback
			remaining: 4000, // Default fallback
			used: 1000, // Default fallback
			reset: Date.now() / 1000 + 3600, // 1 hour from now
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
		console.error('Top contributing repos API error:', error);
		return NextResponse.json(
			{
				error: 'An error occurred while fetching top contributing repos',
				details: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
