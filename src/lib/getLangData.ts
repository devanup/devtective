import GhPolyglot from 'gh-polyglot';
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

export const getUserStats = async (
	username: string,
): Promise<{ stats: any; rateLimit: RateLimit }> => {
	const cacheKey = `user_stats_${username}`;
	const cachedData = cache.get(cacheKey);

	// Check if the data is in cache and not expired
	if (cachedData && cachedData.expiration > Date.now()) {
		return cachedData.data;
	}
	const stats = await new Promise((resolve, reject) => {
		const me = new GhPolyglot(username);
		me.userStats((err: any, stats: any) => {
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

	// Store the result in the cache with an expiration time of 2 hours
	cache.set(cacheKey, {
		data: dataToCache,
		expiration: Date.now() + 2 * 60 * 60 * 1000,
	});

	return { stats, rateLimit };
};
