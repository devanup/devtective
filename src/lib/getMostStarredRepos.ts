import { Repo } from '../types/repo';

export const getMostStarredRepos = (repos: Repo[]) => {
	// Sort the repositories based on the number of stars in descending order
	const sortedRepos = repos.sort((a, b) => b.stargazerCount - a.stargazerCount);

	// Get the top 5 repositories
	const topRepos = sortedRepos.slice(0, 5);

	// Format the data for the chart
	const labels = topRepos.map((repo) => repo.name);
	const data = topRepos.map((repo) => repo.stargazerCount);

	return {
		labels,
		datasets: [
			{
				label: 'Stars',
				data,
				backgroundColor: [
					'rgba(255, 99, 132, 0.4)',
					'rgba(54, 162, 235, 0.4)',
					'rgba(255, 206, 86, 0.4)',
					'rgba(75, 192, 192, 0.4)',
					'rgba(153, 102, 255, 0.4)',
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
				],
				borderWidth: 1,
			},
		],
	};
};
