'use server';

export const fetchUser = async (username: string) => {
	try {
		const res = await fetch(`https://api.github.com/users/${username}`, {
			method: 'GET',
		});
		if (!res.ok) throw new Error('Failed to fetch user data');
		const user = await res.json();
		return user;
	} catch (e) {
		console.log('Error fetching user data: ', e);
	}
};

/*
export const fetchUser = async (username: string): Promise<UserData> => {
	try {
		const res = await fetch(`https://api.github.com/users/${username}`, {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.github.v3+json',
			},
		});
		if (!res.ok) {
			throw new Error(
				`Failed to fetch user data: ${res.status} ${res.statusText}`,
			);
		}
		const user: UserData = await res.json();
		return user;
	} catch (e) {
		console.error('Error fetching user data: ', e);
		throw e; // Re-throw the error so it can be handled by the caller
	}
};
*/
