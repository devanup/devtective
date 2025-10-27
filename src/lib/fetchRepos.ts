import { ReposResponse } from '@/types/repo';

export const fetchRepos = async (
	username: string,
): Promise<ReposResponse> => {
	try {
		const res = await fetch(`/api/repos?username=${encodeURIComponent(username)}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!res.ok) {
			const errorData = await res.json();
			throw new Error(errorData.error || `Failed to fetch repositories: ${res.status}`);
		}

		const data: ReposResponse = await res.json();
		return data;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error('An unexpected error occurred while fetching repositories');
	}
};
