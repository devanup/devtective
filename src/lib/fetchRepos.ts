'use server';

import { Repo } from '@/types/repo';
import { Octokit } from '@octokit/core';

const octokit = new Octokit({
	auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

export const fetchRepos = async (username: string, page = 1, per_page = 30) => {
	try {
		const { data } = await octokit.request('GET /users/{username}/repos', {
			username,
			page,
			per_page,
			headers: {
				'X-GitHub-Api-Version': '2022-11-28',
			},
		});
		return data;
	} catch (error) {
		console.error('Error fetching repositories:', error);
		return [];
	}
};

export const fetchAllRepos = async (
	username: string,
	maxRepos = 150,
): Promise<Repo[]> => {
	let allRepos: string | any[] = [];
	let page = 1;
	const per_page = 30;

	while (allRepos.length < maxRepos) {
		const repos = await fetchRepos(username, page, per_page);
		if (repos.length === 0) break;
		allRepos = [...allRepos, ...repos];
		if (repos.length < per_page) break;
		page++;
	}

	return allRepos.slice(0, maxRepos);
};
