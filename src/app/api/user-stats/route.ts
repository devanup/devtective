import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/core';
import GhPolyglot from 'gh-polyglot';
import { UserStats, RateLimit } from '@/types/user';

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN,
});

// In-memory cache
const cache = new Map<string, { data: { stats: UserStats; rateLimit: RateLimit }; expiration: number }>();

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const username = searchParams.get('username');

	if (!username) {
		return NextResponse.json(
			{ error: 'Username is required' },
			{ status: 400 }
		);
	}

	const cacheKey = `user_stats_${username}`;
	const cachedData = cache.get(cacheKey);

	// Check if data is in cache and not expired
	if (cachedData && cachedData.expiration > Date.now()) {
		return NextResponse.json(cachedData.data);
	}

	try {
		// Fetch stats using gh-polyglot
		const stats: UserStats = await new Promise((resolve, reject) => {
			const me = new GhPolyglot(username);
			me.userStats((err: Error | null, stats: UserStats) => {
				if (err) {
					reject(err);
				} else {
					resolve(stats);
				}
			});
		});

		// Fetch rate limit information
		const { data: rateLimitData } = await octokit.request('GET /rate_limit');
		const rateLimit: RateLimit = {
			limit: rateLimitData.resources.core.limit,
			remaining: rateLimitData.resources.core.remaining,
			used: rateLimitData.resources.core.used,
			reset: rateLimitData.resources.core.reset,
		};

		const dataToCache = { stats, rateLimit };

		// Store in cache with 2-hour expiration
		cache.set(cacheKey, {
			data: dataToCache,
			expiration: Date.now() + 7200000, // 2 hours
		});

		return NextResponse.json(dataToCache);
	} catch (error) {
		return NextResponse.json(
			{ error: 'An error occurred while fetching user stats' },
			{ status: 500 }
		);
	}
}
