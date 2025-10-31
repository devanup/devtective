export interface UserData {
	id: number;
	avatar_url: string;
	name: string | null;
	login: string;
	followers: number;
	following: number;
	public_repos: number;
	created_at: string;
	updated_at: string;
	company: string | null;
	blog: string | null;
	location: string | null;
	twitter_username: string | null;
	type: string;
	bio: string | null;
	html_url: string;
	public_gists: number;
}

export interface RateLimit {
	limit: number;
	remaining: number;
	used: number;
	reset: number;
}

export interface DetailedRateLimit {
	user: RateLimit;
	repos: RateLimit;
	languages: RateLimit;
	topContributing: RateLimit;
}

export interface UserResponse {
	user: UserData;
	rateLimit: RateLimit;
}

export interface LanguageStats {
	[language: string]: number;
}

export interface UserStats {
	[key: string]: LanguageStats;
}

export interface UserStatsResponse {
	stats: UserStats;
	rateLimit: RateLimit;
}
