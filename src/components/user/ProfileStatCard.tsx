'use client';
import { Card } from '@/components/ui/card';
import { Work_Sans } from 'next/font/google';
import { abbreviateNumber } from 'js-abbreviation-number';
import { ProfileStatSkeleton } from '../skeletons/ProfileStatSkeleton';
import React, { Suspense } from 'react';

const workSans = Work_Sans({ weight: '400', subsets: ['latin'] });

interface UserData {
	followers: number;
	following: number;
	public_repos: number;
}

const STATS = [
	{ key: 'followers', label: 'Followers' },
	{ key: 'following', label: 'Following' },
	{ key: 'public_repos', label: 'Repositories' },
] as const;

function StatItem({ value, label }: { value: number; label: string }) {
	return (
		<div className='text-center'>
			<h3 className='text-lg md:text-xl font-bold tracking-wider uppercase mb-1'>
				{abbreviateNumber(value)}
			</h3>
			<p
				className={`text-md md:text-lg text-gray-600 dark:text-muted-foreground ${workSans.className}`}
			>
				{label}
			</p>
		</div>
	);
}

function ProfileStatContent({ userData }: { userData: UserData }) {
	return (
		<Card className='flex md:flex-row flex-col items-center justify-evenly bg-gray-100 rounded-xl p-4'>
			{STATS.map((stat, index) => (
				<React.Fragment key={stat.key}>
					{index > 0 && (
						<div className='w-[2px] h-[70%] bg-slate-200 dark:bg-slate-700 mx-4 hidden md:block' />
					)}
					<StatItem value={userData[stat.key]} label={stat.label} />
				</React.Fragment>
			))}
		</Card>
	);
}

export function ProfileStatCard({ userData }: { userData: UserData | null }) {
	return (
		<Suspense fallback={<ProfileStatSkeleton />}>
			{userData ? (
				<ProfileStatContent userData={userData} />
			) : (
				<ProfileStatSkeleton />
			)}
		</Suspense>
	);
}
