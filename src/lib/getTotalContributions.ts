'use server';

import { fetchRepos } from './fetchRepos';
import { fetchContributorActivity } from './fetchRepoStats';

interface Repo {
	name: string;
	owner: { login: string };
	fork: boolean;
}

interface MonthlyContribution {
	month: string;
	contributions: number;
}

export const getTotalContributions = async (
	username: string,
): Promise<MonthlyContribution[]> => {
	console.log(`Fetching contributions for ${username}`);

	const repos = await fetchRepos(username);
	console.log(`Fetched ${repos.length} repos`);

	// Filter repos that the user doesn't own
	const contributedRepos = repos.filter(
		(repo: Repo) => repo.owner.login !== username,
	);
	console.log(`Found ${contributedRepos.length} contributed repos`);

	const repoActivities = await Promise.all(
		contributedRepos.map(async (repo: Repo) => {
			console.log(`Fetching activity for ${repo.name}`);
			const activity = await fetchContributorActivity(username, repo.name);
			return calculateUserContributions(username, activity);
		}),
	);

	// Combine all contributions
	const combinedContributions = combineContributions(repoActivities);
	console.log(`Combined contributions:`, combinedContributions);

	// Sort by date and take the last 12 months
	const result = sortAndLimitContributions(combinedContributions);
	console.log(`Final result:`, result);
	return result;
};

function calculateUserContributions(
	username: string,
	activity: any[],
): MonthlyContribution[] {
	if (!Array.isArray(activity)) return [];

	const userActivity = activity.find(
		(contributor) => contributor.author?.login === username,
	);
	if (!userActivity || !userActivity.weeks) return [];

	const monthlyContributions: { [key: string]: number } = {};

	userActivity.weeks.forEach((week: any) => {
		const date = new Date(week.w * 1000); // Convert Unix timestamp to Date
		const monthKey = `${date.getFullYear()}-${String(
			date.getMonth() + 1,
		).padStart(2, '0')}`;

		if (!monthlyContributions[monthKey]) {
			monthlyContributions[monthKey] = 0;
		}
		monthlyContributions[monthKey] += week.c;
	});

	return Object.entries(monthlyContributions).map(([month, contributions]) => ({
		month,
		contributions,
	}));
}

function combineContributions(
	repoActivities: MonthlyContribution[][],
): MonthlyContribution[] {
	const combined: { [key: string]: number } = {};

	repoActivities.flat().forEach(({ month, contributions }) => {
		if (!combined[month]) {
			combined[month] = 0;
		}
		combined[month] += contributions;
	});

	return Object.entries(combined).map(([month, contributions]) => ({
		month,
		contributions,
	}));
}

function sortAndLimitContributions(
	contributions: MonthlyContribution[],
): MonthlyContribution[] {
	return contributions
		.sort((a, b) => a.month.localeCompare(b.month))
		.slice(-12);
}
