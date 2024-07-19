import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import { Work_Sans } from 'next/font/google';

const workSans = Work_Sans({ weight: '400', subsets: ['latin'] });

export function ProfileStatCard({ userData }: { userData: any }) {
	// console.log('userData from ProfileStatCard: ', userData);
	return (
		<Card className='flex md:flex-row flex-col items-center justify-evenly bg-gray-100 rounded-xl'>
			<div className='-mb-6 md:mb-0'>
				<CardHeader className='-mb-4 text-center '>
					<CardTitle className={`tracking-wider md:text-xl text-lg`}>
						{/* 8.3k */}
						{userData ? userData.followers : 'NA'}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<CardDescription
						className={`md:text-lg text-md ${workSans.className}`}
					>
						Followers
					</CardDescription>
				</CardContent>
			</div>
			<div className='w-[2px] h-[70%] bg-slate-200' />
			<div className='-mb-6 md:mb-0'>
				<CardHeader className='-mb-4 text-center'>
					<CardTitle className={`tracking-wider md:text-xl text-lg`}>
						{/* 0 */}
						{userData ? userData.following : 'NA'}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<CardDescription
						className={`md:text-lg text-md ${workSans.className}`}
					>
						Following
					</CardDescription>
				</CardContent>
			</div>
			<div className='w-[2px] h-[70%] bg-slate-200' />
			<div>
				<CardHeader className='-mb-4 text-center'>
					<CardTitle className={`tracking-wider md:text-xl text-lg`}>
						2.7k
					</CardTitle>
				</CardHeader>
				<CardContent>
					<CardDescription
						className={`md:text-lg text-md ${workSans.className}`}
					>
						Contributions
					</CardDescription>
				</CardContent>
			</div>
		</Card>
	);
}
