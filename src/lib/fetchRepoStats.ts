// 'use server';

import GhPolyglot from 'gh-polyglot';
import { Octokit } from '@octokit/core';

const octokit = new Octokit({
	auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

export const fetchContributorActivity = async (owner: string, repo: string) => {
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
		return Array.isArray(data) ? data : [];
	} catch (error) {
		console.error('Error fetching contributor activity:', error);
		return [];
	}
};

export const fetchRepoStats = async (username: string, repoName: string) => {
	return new Promise((resolve, reject) => {
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
