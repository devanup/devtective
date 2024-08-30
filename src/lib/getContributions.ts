'use server';

import { Octokit } from '@octokit/core';

const octokit = new Octokit({
	auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

interface ContributionDay {
	weekday: number;
	date: string;
	contributionCount: number;
	color: string;
}

interface ContributionWeek {
	contributionDays: ContributionDay[];
}

interface ContributionMonth {
	name: string;
	year: number;
	firstDay: string;
	totalWeeks: number;
}

interface ContributionData {
	totalContributions: number;
	weeks: ContributionWeek[];
	months: ContributionMonth[];
	rateLimit: {
		limit: number;
		remaining: number;
		resetAt: string;
	};
}

export const getContributions = async (
	username: string,
): Promise<ContributionData> => {
	const currentDate = new Date();
	const startOfYear = new Date(currentDate.getFullYear(), 0, 1);

	const query = `
		query($username: String!, $from: DateTime!, $to: DateTime!) { 
		user(login: $username) {
			contributionsCollection(from: $from, to: $to) {
			contributionCalendar {
				totalContributions
				weeks {
				contributionDays {
					weekday
					date 
					contributionCount 
					color
				}
				}
				months {
				name
				year
				firstDay 
				totalWeeks 
				}
			}
			}
		}
		rateLimit {
          limit
          remaining
          resetAt
        }
    }
    `;

	const variables = {
		username,
		from: startOfYear.toISOString(),
		to: currentDate.toISOString(),
	};

	try {
		const response = await octokit.graphql<{
			user: {
				contributionsCollection: {
					contributionCalendar: {
						totalContributions: number;
						weeks: ContributionWeek[];
						months: ContributionMonth[];
					};
				};
			};
			rateLimit: {
				limit: number;
				remaining: number;
				resetAt: string;
			};
		}>(query, variables);
		const contributionCalendar =
			response.user.contributionsCollection.contributionCalendar;

		return {
			totalContributions: contributionCalendar.totalContributions,
			weeks: contributionCalendar.weeks,
			months: contributionCalendar.months,
			rateLimit: response.rateLimit,
		};
	} catch (error) {
		console.error('Error fetching contribution data:', error);
		throw error;
	}
};
