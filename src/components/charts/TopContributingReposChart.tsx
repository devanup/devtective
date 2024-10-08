'use client';
import { useState, useEffect } from 'react';
import { TopContributingRepos } from './TopContributingRepos';
import { getTopContributingRepos } from '@/lib/getTopContributingRepos';
import { Card, CardContent } from '@/components/ui/card';

interface RepoActivity {
	repo: string;
	totalCommits: number;
}

interface TopContributingReposResult {
	repoActivities: RepoActivity[];
}

export function TopContributingReposChart({ userName }: { userName: string }) {
	const [data, setData] = useState<TopContributingReposResult | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			if (userName && userName !== 'User') {
				setIsLoading(true);
				try {
					const fetchedData = await getTopContributingRepos(userName);
					setData(fetchedData);
					setIsLoading(false);
				} catch (err) {
					setError('Failed to fetch top contributing repos. Please try again.');
					console.error(err);
					setIsLoading(false);
				}
			}
		}
		fetchData();
	}, [userName]);

	if (isLoading) return <TopContributingReposSkeleton />;
	if (error) return <div className='text-red-500 text-center'>{error}</div>;
	if (!data || data.repoActivities.length === 0)
		return (
			<div className='flex justify-center items-center text-muted-foreground h-full'>
				No data available
			</div>
		);

	return (
		<TopContributingRepos data={data.repoActivities} userName={userName} />
	);
}

function TopContributingReposSkeleton() {
	return (
		<Card className='w-[100%] flex flex-col justify-evenly rounded-xl animate-pulse p-0 '>
			<CardContent className='h-[250px] rounded-xl bg-gray-300 dark:bg-gray-700 animate-pulse' />
		</Card>
	);
}
