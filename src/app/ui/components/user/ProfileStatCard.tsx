'use client';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

import { Work_Sans } from 'next/font/google';

import { abbreviateNumber } from 'js-abbreviation-number';

const workSans = Work_Sans({ weight: '400', subsets: ['latin'] });

export function ProfileStatCard({ userData }: { userData: any }) {
	return (
		<Card className='flex md:flex-row flex-col items-center justify-evenly bg-gray-100 rounded-xl'>
			<div className='-mb-6 md:mb-0'>
				<CardHeader className='-mb-4 text-center '>
					<CardTitle className={`tracking-wider md:text-xl text-lg uppercase`}>
						{/* 8.3k */}
						{userData ? abbreviateNumber(userData.followers) : '-'}
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
					<CardTitle className={`tracking-wider md:text-xl text-lg uppercase`}>
						{/* 0 */}
						{userData ? abbreviateNumber(userData.following) : '-'}
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
						{userData ? abbreviateNumber(userData.public_repos) : '-'}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<CardDescription
						className={`md:text-lg text-md ${workSans.className}`}
					>
						Repositories
					</CardDescription>
				</CardContent>
			</div>
		</Card>
	);
}
