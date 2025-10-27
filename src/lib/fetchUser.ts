import { UserResponse } from '@/types/user';

export const fetchUser = async (
	username: string,
): Promise<UserResponse> => {
	try {
		const res = await fetch(`/api/user?username=${encodeURIComponent(username)}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		if (!res.ok) {
			const errorData = await res.json();
			throw new Error(errorData.error || `Failed to fetch user data: ${res.status}`);
		}

		const data: UserResponse = await res.json();
		return data;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error('An unexpected error occurred while fetching user data');
	}
};
