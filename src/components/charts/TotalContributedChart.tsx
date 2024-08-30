'use client';
import { useState, useEffect } from 'react';
import { TotalContributed } from './TotalContributed';
import { Card, CardContent } from '@/components/ui/card';
import { getContributions } from '@/lib/getContributions';

interface TotalContributedChartProps {
	userName: string;
}

export function TotalContributedChart({
	userName,
}: TotalContributedChartProps) {
	const [data, setData] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [rateLimit, setRateLimit] = useState<any>(null);

	useEffect(() => {
		async function fetchData() {
			if (userName && userName !== 'User') {
				setIsLoading(true);

				try {
					// console.log(`Fetching contribution data for ${userName}`);
					const fetchedData = await getContributions(userName);
					// console.log('Fetched contribution data:', fetchedData);
					setData(fetchedData);
					setIsLoading(false);
					setRateLimit(fetchedData.rateLimit);
				} catch (err) {
					// console.error('Error fetching contribution data:', err);
					setError('Failed to fetch contribution data. Please try again.');
				}
			}
		}
		fetchData();
	}, [userName]);

	// useEffect(() => {
	// 	console.log('rateLimit(TotalContributedChart)=> ', rateLimit);
	// }, [rateLimit]);

	if (isLoading) return <TotalContributedSkeleton />;
	if (error) return <div className='text-red-500 text-center'>{error}</div>;
	if (!data) {
		console.log('No contribution data available');
		return (
			<div className='flex justify-center items-center text-muted-foreground h-full'>
				No contribution data available
			</div>
		);
	}

	return <TotalContributed data={data} />;
}

function TotalContributedSkeleton() {
	return (
		<Card className='w-[100%] flex flex-col justify-evenly rounded-xl animate-pulse p-0 '>
			<CardContent className='h-[250px] rounded-xl bg-gray-300 dark:bg-gray-700 animate-pulse' />
		</Card>
	);
}
