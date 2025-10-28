import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/core';
import { UserStats, RateLimit } from '@/types/user';
import { env } from '@/config/env';

const octokit = new Octokit({
	auth: env.GITHUB_TOKEN,
});

// In-memory cache
const cache = new Map<
	string,
	{ data: { stats: UserStats; rateLimit: RateLimit }; expiration: number }
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

	const cacheKey = `user_stats_${username}`;
	const cachedData = cache.get(cacheKey);

	// Check if data is in cache and not expired
	if (cachedData && cachedData.expiration > Date.now()) {
		return NextResponse.json(cachedData.data);
	}

	try {
		// Fetch user's repositories using GraphQL
		const response = await octokit.graphql<{
			user: {
				repositories: {
					nodes: Array<{
						name: string;
						languages: {
							edges: Array<{
								size: number;
								node: {
									name: string;
								};
							}>;
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
		}>(
			`
			query($username: String!, $first: Int!) {
				user(login: $username) {
					repositories(first: $first, ownerAffiliations: OWNER) {
						nodes {
							name
							languages(first: 10) {
								edges {
									size
									node {
										name
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

		// Calculate language statistics
		const languageStats: { [language: string]: number } = {};

		response.user.repositories.nodes.forEach((repo) => {
			repo.languages.edges.forEach((edge) => {
				const langName = edge.node.name;
				const langSize = edge.size;
				if (languageStats[langName]) {
					languageStats[langName] += langSize;
				} else {
					languageStats[langName] = langSize;
				}
			});
		});

		// Convert to the expected format
		const stats: UserStats = {
			[username]: languageStats,
		};

		const rateLimit: RateLimit = {
			limit: response.rateLimit.limit,
			remaining: response.rateLimit.remaining,
			used: response.rateLimit.used,
			reset: new Date(response.rateLimit.resetAt).getTime() / 1000,
		};

		const dataToCache = { stats, rateLimit };

		// OPTIMIZATION: Extended cache to 4 hours to reduce API calls
		cache.set(cacheKey, {
			data: dataToCache,
			expiration: Date.now() + 14400000, // 4 hours (14400000ms)
		});

		return NextResponse.json(dataToCache);
	} catch (error) {
		return NextResponse.json(
			{
				error: 'An error occurred while fetching user stats',
				details: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
