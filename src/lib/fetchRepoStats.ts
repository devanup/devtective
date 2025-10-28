'use server';

import GhPolyglot from 'gh-polyglot';
import { Octokit } from '@octokit/core';
import { ContributorActivity } from '@/types/repo';
import { env } from '@/config/env';

const octokit = new Octokit({
	auth: env.GITHUB_TOKEN,
});

export const fetchContributorActivity = async (
	owner: string,
	repo: string,
): Promise<ContributorActivity[]> => {
	try {
		const { data } = await octokit.request(
			'GET /repos/{owner}/{repo}/stats/contributors',
			{
				owner,
				repo,
				headers: {
					'X-GitHub-Api-Version': '2022-11-28',
				},
			},
		);

		if (!Array.isArray(data)) {
			return [];
		}

		// Map the API response to match our ContributorActivity type
		return data.map((contributor) => ({
			author: contributor.author,
			weeks: contributor.weeks
				.filter((week): week is { w: number; c: number } =>
					typeof week.w === 'number' && typeof week.c === 'number'
				)
				.map(week => ({ w: week.w, c: week.c }))
		}));
	} catch (error) {
		return [];
	}
};

export const fetchRepoStats = async (username: string, repoName: string) => {
	return new Promise((resolve, reject) => {
		// GhPolyglot uses GITHUB_TOKEN from environment variables
		const repo = new GhPolyglot(`${username}/${repoName}`);
		repo.repoStats((err, stats) => {
			if (err) {
				reject(err);
			} else {
				resolve(stats);
			}
		});
	});
};
