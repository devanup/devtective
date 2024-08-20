// src/gh-polyglot.d.ts

declare module 'gh-polyglot' {
	export default class GhPolyglot {
		constructor(username: string);

		repoStats(callback: (err: any, stats: any) => void): void;
		userStats(callback: (err: any, stats: any) => void): void;
		// getAllRepos(callback: (err: any, stats: any) => void): void;
	}
}
