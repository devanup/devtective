'use client';
import { useState, useEffect } from 'react';
import { MostStarred } from './MostStarred';
import { getMostStarredRepos } from '@/lib/getMostStarredRepos';
import { Card, CardContent } from '@/components/ui/card';
import { fetchRepos } from '@/lib/fetchRepos';
import { Repo } from '@/types/repo';

export function MostStarredChart({ userName }: { userName: string }) {
	const [data, setData] = useState<any>({ labels: [], datasets: [] });
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			if (userName && userName !== 'User') {
				setIsLoading(true);
				try {
					const ownedRepos = await fetchRepos(userName, 5);
					// const ownedRepos = allRepos.filter(
					// 	(repo: Repo) => repo.owner.login === userName,
					// );
					const mostStarredData = getMostStarredRepos(ownedRepos.repos);
					setData(mostStarredData);
					setIsLoading(false);
				} catch (err) {
					setError('Failed to fetch most starred repos. Please try again.');
					console.error(err);
				}
			}
		}
		fetchData();
	}, [userName]);

	if (isLoading) return <MostStarredSkeleton />;
	if (error) return <div className='text-red-500 text-center'>{error}</div>;
	if (data.datasets[0]?.data.every((value: number) => value === 0))
		return (
			<div className='flex justify-center items-center text-muted-foreground h-full'>
				No data available
			</div>
		);

	return <MostStarred data={data} userName={userName} />;
}

function MostStarredSkeleton() {
	return (
		<Card className='w-[100%] flex flex-col justify-evenly rounded-xl animate-pulse p-0'>
			<CardContent className='h-[250px] rounded-xl bg-gray-300 dark:bg-gray-700 animate-pulse' />
		</Card>
	);
}
