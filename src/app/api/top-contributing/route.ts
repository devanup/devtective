import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/core';
import { TopContributingRepo, RateLimit, Repo } from '@/types/repo';

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
});

// In-memory cache
const cache = new Map<string, { data: { repoActivities: TopContributingRepo[]; rateLimit: RateLimit }; expiration: number }>();

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const username = searchParams.get('username');

	if (!username) {
		return NextResponse.json(
			{ error: 'Username is required' },
			{ status: 400 }
		);
	}

	const cacheKey = `top_contributing_${username}`;
	const cachedData = cache.get(cacheKey);

	// Check if data is in cache and not expired
	if (cachedData && cachedData.expiration > Date.now()) {
		return NextResponse.json(cachedData.data);
	}

	try {
		// Fetch user's repositories
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
          repositories(first: $first, ownerAffiliations: OWNER) {
            nodes {
              name
              owner {
                login
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

		const repos = response.user.repositories.nodes;

		// Get commit counts for each repo
		const repoActivities = await Promise.all(
			repos.slice(0, 10).map(async (repo) => {
				try {
					const { data } = await octokit.request(
						'GET /repos/{owner}/{repo}/commits',
						{
							owner: repo.owner.login,
							repo: repo.name,
							author: username,
							per_page: 100,
						}
					);

					return {
						repo: repo.name,
						totalCommits: data.length,
					};
				} catch {
					return {
						repo: repo.name,
						totalCommits: 0,
					};
				}
			})
		);

		// Sort by commit count and filter out repos with 0 commits
		const sortedActivities = repoActivities
			.filter((activity) => activity.totalCommits > 0)
			.sort((a, b) => b.totalCommits - a.totalCommits)
			.slice(0, 5);

		const rateLimit: RateLimit = {
			limit: response.rateLimit.limit,
			remaining: response.rateLimit.remaining,
			used: response.rateLimit.used,
			reset: new Date(response.rateLimit.resetAt).getTime() / 1000,
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
			{ error: 'An error occurred while fetching top contributing repos' },
			{ status: 500 }
		);
	}
}
