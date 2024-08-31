'use client';
import { useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { TotalContributed } from '../charts/TotalContributed';
import { BsInfoCircleFill } from 'react-icons/bs';
import { Language, Repo, TopContributingRepo } from '@/types/repo';
import { StatisticsTabSkeleton } from '../skeletons/StatisticsTabSkeletons';
import { getTopContributingRepos } from '@/lib/getTopContributingRepos';
import { TopContributingReposChart } from '../charts/TopContributingReposChart';
import { MostStarredChart } from '../charts/MostStarredChart';
import { TopLanguagesChart } from '../charts/TopLanguagesChart';
import { TotalContributedChart } from '../charts/TotalContributedChart';
import { escapeHtml } from '@/utils/nameUtils';

interface StatisticsTabContentProps {
	repos: Repo[];
	languages: Language[];
	topContributingRepos: TopContributingRepo[];
	userName: string;
	name: string | null;
}

function StatisticsTabContent({
	repos,
	languages,
	userName,
	name,
}: StatisticsTabContentProps) {
	useEffect(() => {
		const fetchTopContributingRepos = async () => {
			if (userName && userName !== 'User') {
				try {
					const fetchedTopContributingRepos = await getTopContributingRepos(
						userName,
					);
					if (fetchedTopContributingRepos.repoActivities.length > 0) {
					} else {
						console.log('No top contributing repos data fetched');
					}
				} catch (error) {
					console.error('Error fetching top contributing repos:', error);
				}
			}
		};

		fetchTopContributingRepos();
	}, [userName]);

	const nameToUse = name ?? 'user';
	const userPossessive = nameToUse?.endsWith('s')
		? `${escapeHtml(nameToUse)}'`
		: `${escapeHtml(nameToUse)}'s`;

	if (repos.length === 0 || languages.length === 0) {
		return <StatisticsTabSkeleton />;
	}

	return (
		<div className='flex flex-col space-y-6 items-center w-full mt-8 mb-10 '>
			<div className='flex flex-col xl:flex-row w-full mx-auto space-x-0 xl:space-x-6 space-y-6 xl:space-y-0'>
				{/* Total Contributed */}
				<Card className='w-[100%] xl:w-[60%] flex flex-col justify-evenly rounded-xl'>
					<CardContent className='h-[300px] p-6 rounded-xl'>
						<TotalContributedChart userName={userName} />
					</CardContent>
					<CardFooter className='flex flex-col items-start px-6'>
						<div className='flex space-x-2 items-center'>
							<h1 className='font-bold text-lg'>Contributions Over Time</h1>
							{/* <BsInfoCircleFill
								className='text-muted-foreground/60'
								size={15}
							/> */}
						</div>
						<p className='text-muted-foreground'>
							Illustrates {userPossessive} GitHub activity, showcasing
							dedication from commits to community interactions throughout the
							year
							{/* Emphasizes the total number of contributions, showcasing{' '}
							{userPossessive} dedication to the community */}
						</p>
					</CardFooter>
				</Card>

				{/* Most Starred */}
				<Card className='w-[100%] xl:w-[40%] flex flex-col justify-evenly rounded-xl'>
					<CardContent className='h-[300px] p-6 rounded-xl'>
						<MostStarredChart userName={userName} />
					</CardContent>
					<CardFooter className='flex flex-col items-start px-6'>
						<div className='flex space-x-2 items-center'>
							<h1 className='font-bold text-lg'>Most Starred</h1>
							{/* <BsInfoCircleFill
								className='text-muted-foreground/60'
								size={15}
							/> */}
						</div>
						<p className='text-muted-foreground'>
							Emphasizes which repositories are the most popular, showcasing{' '}
							{userPossessive} popularity in different projects
						</p>
					</CardFooter>
				</Card>
			</div>

			<div className='flex flex-col xl:flex-row w-full mx-auto space-x-0 xl:space-x-6 space-y-6 xl:space-y-0'>
				{/* Top Languages */}
				<Card className='w-[100%] xl:w-[40%] flex flex-col rounded-xl'>
					<CardContent className='h-[300px] rounded-xl mt-6'>
						<TopLanguagesChart languages={languages} userName={userName} />
					</CardContent>
					<CardFooter className='flex flex-col items-start px-6'>
						<div className='flex space-x-2 items-center'>
							<h1 className='font-bold text-lg'>Top Languages</h1>
							{/* <BsInfoCircleFill
								className='text-muted-foreground/60'
								size={15}
							/> */}
						</div>
						<p className='text-muted-foreground'>
							Emphasizes which languages are the most popular, showcasing{' '}
							{userPossessive} expertise in different programming languages
						</p>
					</CardFooter>
				</Card>

				{/* Top Contributing Repos */}
				<Card className='w-[100%] xl:w-[60%] flex flex-col justify-evenly rounded-xl'>
					<CardContent className='h-[300px] p-6 rounded-xl'>
						<TopContributingReposChart userName={userName} />
					</CardContent>
					<CardFooter className='flex flex-col items-start px-6'>
						<div className='flex space-x-2 items-center'>
							<h1 className='font-bold text-lg'>
								Top Contributing Repositories
							</h1>
							{/* <BsInfoCircleFill
								className='text-muted-foreground/60'
								size={15}
							/> */}
						</div>
						<p className='text-muted-foreground'>
							The most active repositories {nameToUse} has contributed to are
							highlighted in the chart
						</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}

export function StatisticsTab({
	repos,
	languages,
	topContributingRepos,
	userName,
	name,
}: StatisticsTabContentProps) {
	return (
		<div className='h-full always-visible-scrollbar'>
			<StatisticsTabContent
				key={userName}
				repos={repos}
				languages={languages}
				topContributingRepos={topContributingRepos}
				userName={userName}
				name={name}
			/>
		</div>
	);
}
