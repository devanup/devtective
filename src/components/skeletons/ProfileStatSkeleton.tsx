import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
} from '@/components/ui/card';
import { Work_Sans } from 'next/font/google';

const workSans = Work_Sans({ weight: '400', subsets: ['latin'] });

export function ProfileStatSkeleton() {
	return (
		<Card className='flex md:flex-row flex-col items-center justify-evenly bg-gray-100 rounded-lg animate-pulse'>
			{[1, 2, 3].map((index) => (
				<div key={index} className=' md:mb-0'>
					<CardHeader className='-mb-4 text-center'>
						<CardTitle
							className={`w-15 h-8 tracking-wider md:text-xl text-lg uppercase bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse`}
						/>
					</CardHeader>
					<CardContent>
						<CardDescription
							className={`md:text-lg text-md w-20 h-4 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse ${workSans.className}`}
						/>
					</CardContent>
				</div>
			))}
		</Card>
	);
}
