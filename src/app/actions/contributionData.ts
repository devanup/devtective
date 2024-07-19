'use server';

export const getContributionData = async (username: string) => {
	try {
		const res = await fetch(
			`https://github-contributions-api.jogruber.de/v4/${username}`,
			{
				method: 'GET',
			},
		);
		if (!res.ok) throw new Error('Failed to fetch contribution data');
		const data = await res.json();
		console.log('Contribution data: ', data);
		return data.total; // Extract and return only the "total" field
	} catch (e) {
		console.log('Error fetching contribution data: ', e);
		return null;
	}
};
