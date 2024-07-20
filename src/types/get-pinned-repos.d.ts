/**
 * Repo language
 * @typedef {Object} ILanguage
 * @property {string} name Language name code
 * @property {string} color Language color
 * @property {string} id Language id in Github database
 */

/**
 * Pinned Repo type
 * @typedef {Object} IPinnedRepo
 * @property {string} name Repo name
 * @property {string} url Repo URL
 * @property {string} stargazerCount Stargazer count
 * @property {ILanguage?} primaryLanguage Repo primary language
 * @property {string} description Repo description
 * @property {string} createdAt Repo creation date
 * @property {number} forkCount Repo fork count
 * @property {string} homepageUrl Repo homepage url
 * @property {string} id Repo id
 * @property {boolean} isArchived Is repo archived?
 * @property {boolean} isFork Is repo a fork of another repo?
 * @property {boolean} isInOrganization Is repo in an organization?
 * @property {boolean} isTemplate Is repo a template?
 * @property {Array<ILanguage>?} languages All languages used in repo
 */

/**
 * Response Type, includes the pinned repos
 * @typedef {Object} IRes
 * @property {Object} user Github user GQL response
 * @property {Object} user.pinnedItems Github user pinned repo GQL reponse
 * @property {Array<IPinnedRepo>} user.pinnedItems.nodes All pinned items
 */

/**
 * @class
 * @classdesc Main client class
 */
declare module 'get-pinned-repos' {
	export interface ILanguage {
		name: string;
		color: string;
		id: string;
	}

	export interface IPinnedRepo {
		name: string;
		url: string;
		stargazerCount: string;
		primaryLanguage?: ILanguage;
		description: string;
		createdAt: string;
		forkCount: number;
		homepageUrl: string;
		id: string;
		isArchived: boolean;
		isFork: boolean;
		isInOrganization: boolean;
		isTemplate: boolean;
		languages?: ILanguage[];
	}

	export interface IRes {
		user: {
			pinnedItems: {
				nodes: IPinnedRepo[];
			};
		};
	}

	export class Client {
		static setToken(token: string): void;
		static getPinnedRepos(username: string): Promise<IPinnedRepo[]>;
	}
}
