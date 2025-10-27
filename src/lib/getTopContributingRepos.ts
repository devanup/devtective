import { TopContributingRepo, RateLimit } from '@/types/repo';

export interface TopContributingResponse {
	repoActivities: TopContributingRepo[];
	rateLimit: RateLimit;
}

export const getTopContributingRepos = async (
	username: string,
): Promise<TopContributingResponse> => {
	try {
		const res = await fetch(`/api/top-contributing?username=${encodeURIComponent(username)}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!res.ok) {
			const errorData = await res.json();
			throw new Error(errorData.error || `Failed to fetch top contributing repos: ${res.status}`);
		}

		const data: TopContributingResponse = await res.json();
		return data;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error('An unexpected error occurred while fetching top contributing repos');
	}
};
