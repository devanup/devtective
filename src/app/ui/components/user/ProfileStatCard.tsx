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

interface UserDetailsCardProps {
	userData: any;
	contributionData: { [key: string]: number | null };
}

export function ProfileStatCard({
	userData,
	contributionData,
}: UserDetailsCardProps) {
	// Sum all contributions from the "total" object
	const totalContributions = contributionData
		? Object.values(contributionData).reduce(
				(sum, count) => (sum as number) + (count as number),
				0,
		  )
		: 'NA';
	return (
		<Card className='flex md:flex-row flex-col items-center justify-evenly bg-gray-100 rounded-xl'>
			<div className='-mb-6 md:mb-0'>
				<CardHeader className='-mb-4 text-center '>
					<CardTitle className={`tracking-wider md:text-xl text-lg`}>
						{/* 8.3k */}
						{userData ? abbreviateNumber(userData.followers) : 'NA'}
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
						{userData ? abbreviateNumber(userData.following) : 'NA'}
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
						{/* {abbreviateNumber(totalContributions)} */}
						{typeof totalContributions === 'number'
							? abbreviateNumber(totalContributions)
							: 'NA'}
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
