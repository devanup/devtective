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

// In-memory cache object
const cache = new Map<string, { data: any; expiration: number }>();

export const fetchRepos = async (
	username: string,
): Promise<{ repos: any[]; rateLimit: RateLimit }> => {
	const cacheKey = `repos_${username}`;
	const cachedData = cache.get(cacheKey);

	// Check if the data is in cache and not expired
	if (cachedData && cachedData.expiration > Date.now()) {
		return cachedData.data;
	}

	try {
		const response: any = await octokit.graphql(
			// repositories(first: $first, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
			`
      query($username: String!, $first: Int!) {
        user(login: $username) {
          repositories(first: $first, ownerAffiliations: OWNER, orderBy: {field: STARGAZERS, direction: DESC}) {
            nodes {
              name
              owner {
                login
              }
              description
              stargazerCount
              forkCount
              diskUsage
              updatedAt
              pushedAt
              url
              primaryLanguage {
                name
                color
              }
              defaultBranchRef {
                target {
                  ... on Commit {
                    history(first: 1) {
                      edges {
                        node {
                          committedDate
                        }
                      }
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
    `,
			{
				username: username,
				first: 100,
				// first: 10,
			},
		);

		const rateLimit: RateLimit = {
			limit: response.rateLimit.limit,
			remaining: response.rateLimit.remaining,
			used: response.rateLimit.used,
			reset: new Date(response.rateLimit.resetAt).getTime() / 1000,
		};

		const dataToCache = {
			repos: response.user.repositories.nodes,
			rateLimit,
		};

		// Store the result in the cache with an expiration time of 2 hours
		cache.set(cacheKey, {
			data: dataToCache,
			expiration: Date.now() + 2 * 60 * 60 * 1000,
		});

		return dataToCache;
	} catch (error) {
		console.error('Error fetching repositories:', error);
		throw error;
	}
};
