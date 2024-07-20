'use server';

export const getUserAndContributionData = async (username: string) => {
	try {
		const [userRes, contributionRes] = await Promise.all([
			fetch(`https://api.github.com/users/${username}`, { method: 'GET' }),
			fetch(`https://github-contributions-api.jogruber.de/v4/${username}`, {
				method: 'GET',
			}),
		]);

		if (!userRes.ok) throw new Error('Failed to fetch user data');
		if (!contributionRes.ok)
			throw new Error('Failed to fetch contribution data');

		const userData = await userRes.json();
		const contributionData = await contributionRes.json();

		return {
			userData,
			contributionData: contributionData.total,
		};
	} catch (e) {
		console.log('Error fetching data: ', e);
		return null;
	}
};
