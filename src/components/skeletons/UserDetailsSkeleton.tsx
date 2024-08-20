import { Card } from '@/components/ui/card';

export function UserDetailsSkeleton() {
	return (
		<Card className='flex flex-col space-y-4 bg-gray-100 rounded-xl p-6 animate-pulse'>
			{[...Array(5)].map((_, index) => (
				<div key={index} className='flex w-full items-center space-x-3'>
					<div className='w-10 h-10 rounded-xl bg-gray-300 dark:bg-gray-700 animate-pulse' />
					<div className='h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse' />
				</div>
			))}
		</Card>
	);
}
