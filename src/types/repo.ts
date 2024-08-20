type Repo = {
	id: number;
	owner: {
		login: string;
	};
	name: string;
	description: string;
	forks: number;
	stargazers_count: number;
	commits_url: string; // url to the commits
	html_url: string; // url to the repo
	languages_url: string; // url to the languages
	contributors_url: string; // url to the contributors
	language: string;
	created_at: string;
	updated_at: string;
	pushed_at: string;
	size: number;
};

type Language = {
	label: string;
	value: number;
	color: string;
};

type TopContributingRepo = {
	repo: string;
	totalCommits: number;
};

export type { Repo, Language, TopContributingRepo };
