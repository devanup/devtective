export interface Repo {
	name: string;
	owner: {
		login: string;
	};
	description: string | null;
	stargazerCount: number;
	forkCount: number;
	diskUsage: number;
	updatedAt: string;
	pushedAt: string;
	url: string;
	primaryLanguage: {
		name: string;
		color: string;
	} | null;
	defaultBranchRef: {
		target: {
			history: {
				edges: Array<{
					node: {
						committedDate: string;
					};
				}>;
			};
		};
	} | null;
	collaborators?: {
		edges: Array<{
			node: {
				login: string;
				avatarUrl: string;
			};
		}>;
	};
}

export interface Language {
	label: string;
	value: number;
	color: string;
}

export interface TopContributingRepo {
	repo: string;
	totalCommits: number;
}

export interface ReposResponse {
	repos: Repo[];
	rateLimit: RateLimit;
}

export interface RateLimit {
	limit: number;
	remaining: number;
	used: number;
	reset: number;
}

export interface MonthlyContribution {
	month: string;
	contributions: number;
}

export interface ContributorActivity {
	author: {
		login: string;
	} | null;
	weeks: Array<{
		w: number;
		c: number;
	}>;
}

export interface PinnedRepo {
	owner: string;
	repo: string;
	description: string | null;
	language: string | null;
	languageColor: string | null;
	stars: number;
	forks: number;
}
