'use server';

interface RateLimit {
	limit: number;
	remaining: number;
	used: number;
	reset: number;
}

export const fetchUser = async (
	username: string,
): Promise<{ user: any; rateLimit: RateLimit }> => {
	try {
		const res = await fetch(`https://api.github.com/users/${username}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
				Accept: 'application/vnd.github.v3+json',
			},
			next: {
				tags: [`user-${username}`],
				revalidate: 2 * 60 * 60 * 1000, // 2 hours
			},
		});

		if (!res.ok) {
			if (res.status === 403) {
				const rateLimitRemaining = parseInt(
					res.headers.get('x-ratelimit-remaining') || '0',
				);
				if (rateLimitRemaining === 0) {
					console.log('Rate limit has been exceeded');
				}
			}
			throw new Error(
				`Failed to fetch user data: ${res.status} ${res.statusText}`,
			);
		}

		const user = await res.json();
		const rateLimit: RateLimit = {
			limit: parseInt(res.headers.get('x-ratelimit-limit') || '0'),
			remaining: parseInt(res.headers.get('x-ratelimit-remaining') || '0'),
			used: parseInt(res.headers.get('x-ratelimit-used') || '0'),
			reset: parseInt(res.headers.get('x-ratelimit-reset') || '0'),
		};

		return { user, rateLimit };
	} catch (e) {
		console.log('Error fetching user data: ', e);
		throw e;
	}
};
