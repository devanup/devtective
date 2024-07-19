'use server';
export const getUserData = async (username: string) => {
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
