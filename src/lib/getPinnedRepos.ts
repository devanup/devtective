'use server';

import { Client, IPinnedRepo } from 'get-pinned-repos';

const githubToken = process.env.GITHUB_TOKEN;

export const getPinnedRepos = async (username: string): Promise<IPinnedRepo[]> => {
	Client.setToken(githubToken as string);
	return await Client.getPinnedRepos(username);
};
