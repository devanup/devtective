'use server';

import { Octokit } from '@octokit/core';

const octokit = new Octokit({
	auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

interface Repository {
	name: string;
	owner: {
		login: string;
	};
	defaultBranchRef: {
		name: string;
	};
}

interface RepoActivity {
	repo: string;
	totalCommits: number;
}

export const getTopContributingRepos = async (
	username: string,
): Promise<RepoActivity[]> => {
	try {
		// Get user's repositories
		const reposQuery = `
      query ($username: String!) {
			user(login: $username) {
				repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
				nodes {
					name
					owner {
					login
					}
					defaultBranchRef {
					name
					}
				}
					}
			}
		}
    `;

		const reposResponse = await octokit.graphql<{
			user: { repositories: { nodes: Repository[] } };
		}>(reposQuery, { username });

		const repos = reposResponse.user.repositories.nodes;

		// Get commit count for each repository
		const repoActivities: RepoActivity[] = await Promise.all(
			repos.map(async (repo) => {
				const commitCountQuery = `
          query($owner: String!, $name: String!, $branch: String!) {
            repository(owner: $owner, name: $name) {
              object(expression: $branch) {
                ... on Commit {
                  history {
                    totalCount
                  }
                }
              }
            }
          }
        `;

				const commitCountResponse = await octokit.graphql<{
					repository: {
						object: {
							history: {
								totalCount: number;
							};
						};
					};
				}>(commitCountQuery, {
					owner: repo.owner.login,
					name: repo.name,
					branch: repo?.defaultBranchRef?.name || 'main' || 'master',
				});

				return {
					repo: repo.name,
					totalCommits:
						commitCountResponse?.repository?.object?.history?.totalCount || 0,
				};
			}),
		);

		// Sort and return top 5 repositories
		return repoActivities
			.sort((a, b) => b.totalCommits - a.totalCommits)
			.slice(0, 5);
	} catch (error) {
		console.error('Error fetching top contributing repos:', error);
		throw error;
	}
};
