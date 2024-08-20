import { Card, CardContent, CardFooter } from '@/components/ui/card';

export function TotalContributionSkeleton() {
	return (
		<Card className='w-[60%] flex flex-col justify-evenly rounded-xl animate-pulse'>
			<CardContent className='h-[300px] m-6 rounded-xl bg-gray-300 dark:bg-gray-700 animate-pulse' />
			<CardFooter className='flex flex-col items-start px-6'>
				<div className='w-1/2 h-6 bg-gray-300 dark:bg-gray-700 rounded' />
				<div className='w-full h-4 mt-2 bg-gray-300 dark:bg-gray-700 rounded' />
			</CardFooter>
		</Card>
	);
}

export function MostStarredSkeleton() {
	return (
		<Card className='w-[40%] flex flex-col justify-evenly rounded-xl animate-pulse'>
			<CardContent className='h-[300px] m-6 rounded-xl bg-gray-300 dark:bg-gray-700 animate-pulse' />
			<CardFooter className='flex flex-col items-start px-6'>
				<div className='w-1/2 h-6 bg-gray-300 dark:bg-gray-700 rounded' />
				<div className='w-full h-4 mt-2 bg-gray-300 dark:bg-gray-700 rounded' />
			</CardFooter>
		</Card>
	);
}

export function TopLanguagesSkeleton() {
	return (
		<Card className='w-[40%] flex flex-col justify-evenly rounded-xl animate-pulse'>
			<CardContent className='h-[300px] m-6 rounded-xl bg-gray-300 dark:bg-gray-700 animate-pulse' />
			<CardFooter className='flex flex-col items-start px-6'>
				<div className='w-1/2 h-6 bg-gray-300 dark:bg-gray-700 rounded' />
				<div className='w-full h-4 mt-2 bg-gray-300 dark:bg-gray-700 rounded' />
			</CardFooter>
		</Card>
	);
}

export function TopContributingReposSkeleton() {
	return (
		<Card className='w-[60%] flex flex-col justify-evenly rounded-xl animate-pulse'>
			<CardContent className='h-[300px] m-6 rounded-xl bg-gray-300 dark:bg-gray-700 animate-pulse' />
			<CardFooter className='flex flex-col items-start px-6'>
				<div className='w-1/2 h-6 bg-gray-300 dark:bg-gray-700 rounded' />
				<div className='w-full h-4 mt-2 bg-gray-300 dark:bg-gray-700 rounded' />
			</CardFooter>
		</Card>
	);
}

export function StatisticsTabSkeleton() {
	return (
		<div className='flex flex-col space-y-6 items-center w-full my-10'>
			<div className='flex w-full mx-auto space-x-6'>
				<TotalContributionSkeleton />
				<MostStarredSkeleton />
			</div>
			<div className='flex justify-evenly w-full mx-auto space-x-6'>
				<TopLanguagesSkeleton />
				<TopContributingReposSkeleton />
			</div>
		</div>
	);
}
