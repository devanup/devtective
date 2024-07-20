'use server';

import { Client } from 'get-pinned-repos';

const githubToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

export const getPinnedRepos = async (username: string) => {
	Client.setToken(githubToken as string);
	return await Client.getPinnedRepos(username);
};
