'use server';

import { Client } from 'get-pinned-repos';
import { PinnedRepo } from '@/types/repo';

const githubToken = process.env.GITHUB_TOKEN;

export const getPinnedRepos = async (username: string): Promise<PinnedRepo[]> => {
	Client.setToken(githubToken as string);
	return await Client.getPinnedRepos(username);
};
