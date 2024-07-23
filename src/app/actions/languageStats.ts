// src/actions/languageStats.ts

import GhPolyglot from 'gh-polyglot';

export const getRepoStats = (username: string, repoName: string) => {
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

export const getUserStats = (username: string) => {
	return new Promise((resolve, reject) => {
		const user = new GhPolyglot(username);
		user.userStats((err, stats) => {
			if (err) {
				reject(err);
			} else {
				resolve(stats);
			}
		});
	});
};

// getAllRepos(callback)

export const getAllRepos = (username: string) => {
	return new Promise((resolve, reject) => {
		const user = new GhPolyglot(username);
		user.getAllRepos((err, stats) => {
			if (err) {
				reject(err);
			} else {
				resolve(stats);
			}
		});
	});
};
