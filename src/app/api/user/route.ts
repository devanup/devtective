import { NextRequest, NextResponse } from 'next/server';
import { UserData, RateLimit } from '@/types/user';
import { env } from '@/config/env';

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const username = searchParams.get('username');

	if (!username) {
		return NextResponse.json(
			{ error: 'Username is required' },
			{ status: 400 }
		);
	}

	try {
		const res = await fetch(`https://api.github.com/users/${username}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${env.GITHUB_TOKEN}`,
				Accept: 'application/vnd.github.v3+json',
			},
			next: {
				tags: [`user-${username}`],
				revalidate: 7200, // 2 hours
			},
		});

		if (!res.ok) {
			if (res.status === 403) {
				const rateLimitRemaining = parseInt(
					res.headers.get('x-ratelimit-remaining') || '0',
				);
				if (rateLimitRemaining === 0) {
					return NextResponse.json(
						{ error: 'Rate limit exceeded' },
						{ status: 429 }
					);
				}
			}
			return NextResponse.json(
				{ error: `Failed to fetch user data: ${res.status} ${res.statusText}` },
				{ status: res.status }
			);
		}

		const user: UserData = await res.json();
		const rateLimit: RateLimit = {
			limit: parseInt(res.headers.get('x-ratelimit-limit') || '0'),
			remaining: parseInt(res.headers.get('x-ratelimit-remaining') || '0'),
			used: parseInt(res.headers.get('x-ratelimit-used') || '0'),
			reset: parseInt(res.headers.get('x-ratelimit-reset') || '0'),
		};

		return NextResponse.json({ user, rateLimit });
	} catch (error) {
		return NextResponse.json(
			{ error: 'An error occurred while fetching user data' },
			{ status: 500 }
		);
	}
}
