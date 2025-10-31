import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/core';
import { Repo, RateLimit } from '@/types/repo';
import { env } from '@/config/env';

const octokit = new Octokit({
	auth: env.GITHUB_TOKEN,
});

// In-memory cache
const cache = new Map<string, { data: { repos: Repo[]; rateLimit: RateLimit }; expiration: number }>();

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const username = searchParams.get('username');

	if (!username) {
		return NextResponse.json(
			{ error: 'Username is required' },
			{ status: 400 }
		);
	}

	const cacheKey = `repos_${username}`;
	const cachedData = cache.get(cacheKey);

	// Check if data is in cache and not expired
	if (cachedData && cachedData.expiration > Date.now()) {
		return NextResponse.json(cachedData.data);
	}

	try {
		const response = await octokit.graphql<{
			user: {
				repositories: {
					nodes: Repo[];
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
      query($username: String!, $first: Int!) {
        user(login: $username) {
          repositories(first: $first, ownerAffiliations: OWNER, privacy: PUBLIC) {
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

		// OPTIMIZATION: Extended cache to 4 hours to reduce API calls
		cache.set(cacheKey, {
			data: dataToCache,
			expiration: Date.now() + 14400000, // 4 hours (14400000ms)
		});

		return NextResponse.json(dataToCache);
	} catch (error) {
		return NextResponse.json(
			{ error: 'An error occurred while fetching repositories' },
			{ status: 500 }
		);
	}
}
