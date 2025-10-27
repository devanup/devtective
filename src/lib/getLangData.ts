import { UserStatsResponse } from '@/types/user';

export const getUserStats = async (
	username: string,
): Promise<UserStatsResponse> => {
	try {
		const res = await fetch(`/api/user-stats?username=${encodeURIComponent(username)}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!res.ok) {
			const errorData = await res.json();
			throw new Error(errorData.error || `Failed to fetch user stats: ${res.status}`);
		}

		const data: UserStatsResponse = await res.json();
		return data;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error('An unexpected error occurred while fetching user stats');
	}
};
