import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import { Work_Sans } from 'next/font/google';

const workSans = Work_Sans({ weight: '400', subsets: ['latin'] });

export function ProfileStatCard() {
	return (
		<Card className='flex flex-row items-center justify-evenly lg:justify-between bg-gray-100 rounded-xl'>
			<div>
				<CardHeader className='-mb-4 text-center'>
					<CardTitle className={`tracking-wider`}>8.3k</CardTitle>
				</CardHeader>
				<CardContent>
					<CardDescription className={`text-lg ${workSans.className}`}>
						Followers
					</CardDescription>
				</CardContent>
			</div>
			<div className='w-[2px] h-[70%] bg-slate-200' />
			<div>
				<CardHeader className='-mb-4 text-center'>
					<CardTitle className={`tracking-wider`}>0</CardTitle>
				</CardHeader>
				<CardContent>
					<CardDescription className={`text-lg ${workSans.className}`}>
						Following
					</CardDescription>
				</CardContent>
			</div>
			<div className='w-[2px] h-[70%] bg-slate-200' />
			<div>
				<CardHeader className='-mb-4 text-center'>
					<CardTitle className={`tracking-wider`}>2.7k</CardTitle>
				</CardHeader>
				<CardContent>
					<CardDescription className={`text-lg ${workSans.className}`}>
						Contributions
					</CardDescription>
				</CardContent>
			</div>
		</Card>
	);
}
