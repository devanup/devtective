'use server';

import { Octokit } from '@octokit/core';

const octokit = new Octokit({
	auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

interface RateLimit {
	limit: number;
	remaining: number;
	used: number;
	reset: number;
}

interface RepoActivity {
	repo: string;
	totalCommits: number;
}

// In-memory cache object
const cache = new Map<string, { data: any; expiration: number }>();

export const getTopContributingRepos = async (
	username: string,
): Promise<{
	repoActivities: RepoActivity[];
	rateLimit: RateLimit;
}> => {
	const cacheKey = `top_contributing_repos_${username}`;
	const cachedData = cache.get(cacheKey);

	// Check if the data is in cache and not expired
	if (cachedData && cachedData.expiration > Date.now()) {
		return cachedData.data;
	}

	try {
		const query = `
		query ($username: String!) {
			user(login: $username) {
				repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
					nodes {
						name
						defaultBranchRef {
							target {
								... on Commit {
									history {
										totalCount
									}
								}
							}
						}
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
		`;

		const response = await octokit.graphql<{
			user: {
				repositories: {
					nodes: Array<{
						name: string;
						defaultBranchRef: {
							target: {
								history: {
									totalCount: number;
								};
							};
						};
					}>;
				};
			};
			rateLimit: {
				limit: number;
				remaining: number;
				used: number;
				resetAt: string;
			};
		}>(query, { username });

		const repos = response.user.repositories.nodes;

		const repoActivities: RepoActivity[] = repos
			.map((repo) => ({
				repo: repo.name,
				totalCommits: repo.defaultBranchRef?.target.history.totalCount || 0,
			}))
			.sort((a, b) => b.totalCommits - a.totalCommits)
			.slice(0, 5);

		const rateLimit: RateLimit = {
			limit: response.rateLimit.limit,
			remaining: response.rateLimit.remaining,
			used: response.rateLimit.used,
			reset: new Date(response.rateLimit.resetAt).getTime() / 1000,
		};

		const dataToCache = {
			repoActivities,
			rateLimit,
		};

		// Store the result in the cache with an expiration time of 2 hours
		cache.set(cacheKey, {
			data: dataToCache,
			expiration: Date.now() + 2 * 60 * 60 * 1000,
		});

		return dataToCache;
	} catch (error) {
		console.error('Error fetching top contributing repos:', error);
		throw error;
	}
};
