'use client';
import { MotionValue, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Repo } from '@/types/repo';
import { Card } from './card';
import { SiGithub } from 'react-icons/si';
import { abbreviateNumber } from 'js-abbreviation-number';
import { IoStar } from 'react-icons/io5';
import { BiGitRepoForked } from 'react-icons/bi';

interface ParallaxScrollProps {
	repos: Repo[];
	className?: string;
}

const RepoCardSkeleton = () => (
	<Card className='w-full md:h-80 h-fit p-6 rounded-xl flex flex-col gap-3 relative overflow-hidden shadow-none border animate-pulse'>
		<div className='absolute top-1/2 transform -translate-y-1/2 -right-52 opacity-[4%]'>
			<SiGithub size={400} />
		</div>
		<div className='w-20 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse' />
		<span className='w-3/4 h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse' />
		<span className='w-full h-24 my-3 bg-gray-300 dark:bg-gray-700 rounded animate-pulse' />
		<div className='flex items-center gap-2 mt-auto'>
			<div className='flex items-center gap-4'>
				<span className='w-16 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse' />
				<span className='w-16 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse' />
			</div>
			<span className='w-16 h-4 ml-auto bg-gray-300 dark:bg-gray-700 rounded animate-pulse' />
		</div>
	</Card>
);

// Extracting RepoCard component
const RepoCard = ({ repo }: { repo: Repo }) => (
	<Link
		href={`https://github.com/${repo.owner.login}/${repo.name}`}
		target='_blank'
	>
		<Card className='w-full md:h-80 h-fit p-6 rounded-xl flex flex-col gap-3 relative overflow-hidden shadow-none border  bottom-0 transition-all ease-in-out duration-200 hover:bottom-1 hover:shadow-md'>
			{/* Github icon background */}
			<div className='absolute top-1/2 transform -translate-y-1/2 -right-52 opacity-[4%]'>
				<SiGithub size={400} />
			</div>
			{/* Repo name, description, language */}
			<div className='flex justify-between items-center text-gray-500 dark:text-muted-foreground text-sm'>
				{/* <span>{repo.language}</span> */}
				{repo.primaryLanguage && <span>{repo.primaryLanguage.name}</span>}
				<span>
					{new Date(repo.pushedAt).toLocaleDateString('en-US', {
						month: 'long',
						day: 'numeric',
						year: 'numeric',
					})}
				</span>
			</div>
			<h1 className='font-bold text-2xl'>{repo.name}</h1>
			<p className='text-sm text-gray-500 dark:text-muted-foreground my-3 flex-grow'>
				{repo.description && repo.description.length > 350
					? `${repo.description.slice(0, 350)}...`
					: repo.description}
			</p>
			{/* Language, Stars, Forks */}
			<div className='text-gray-500 flex items-center gap-2 mt-auto text-sm'>
				<div className='flex items-center gap-4'>
					{/* Stars */}
					<div className='flex gap-1'>
						<IoStar size={17} />
						<span>{abbreviateNumber(repo.stargazerCount)}</span>
					</div>
					{/* Forks */}
					<div className='flex gap-1'>
						<BiGitRepoForked size={18} />
						<span>{abbreviateNumber(repo.forkCount)}</span>
					</div>
				</div>
				{/* Repo size */}
				<div className='flex ml-auto'>
					{abbreviateNumber(repo.diskUsage)} KB
				</div>
			</div>
		</Card>
	</Link>
);

export const ParallaxScroll = ({ repos, className }: ParallaxScrollProps) => {
	const VISIBLE_REPOS = 10;
	const gridRef = useRef<HTMLDivElement>(null);
	const [showButton, setShowButton] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	useEffect(() => {
		// Simulate loading delay
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 0);

		return () => clearTimeout(timer);
	}, []);
	const { scrollYProgress } = useScroll({
		container: gridRef,
		offset: ['start start', 'end start'],
	});

	useEffect(() => {
		const unsubscribe = scrollYProgress.onChange((latest) => {
			if (latest > 0.2 && !showButton) {
				// Adjust this threshold as needed
				setShowButton(true);
			}
		});

		return () => unsubscribe();
	}, [scrollYProgress, showButton]);

	const translateFirst = useTransform(scrollYProgress, [0, 1], [-150, -300]);
	const translateSecond = useTransform(scrollYProgress, [0, 1], [-150, 200]);

	// const sortedRepos = [...repos].sort((a, b) => {
	// 	const dateA = new Date(a.updatedAt);
	// 	const dateB = new Date(b.updatedAt);
	// 	return dateB.getTime() - dateA.getTime();
	// });
	// Check if repos is an array and has items
	const validRepos = Array.isArray(repos) ? repos : [];
	const displayedRepos = validRepos.slice(0, VISIBLE_REPOS);

	// const handleShowMore = () => {
	// 	const newVisibleRepos = Math.min(visibleRepos + 6, repos.length);
	// 	setVisibleRepos(newVisibleRepos);
	// 	onVisibleReposChange(newVisibleRepos);
	// };

	const renderRepoList = (
		repoList: Repo[],
		translateY: MotionValue<number>,
	) => (
		<div className='grid gap-10'>
			{isLoading
				? Array(3)
						.fill(0)
						.map((_, idx) => (
							<motion.div style={{ y: translateY }} key={`skeleton-${idx}`}>
								<RepoCardSkeleton />
							</motion.div>
						))
				: repoList.map((repo, idx) => (
						<motion.div style={{ y: translateY }} key={`grid-${idx}`}>
							<RepoCard repo={repo} />
						</motion.div>
				  ))}
		</div>
	);
	// console.log('repos=>', repos);
	return (
		<div
			className={cn(
				'h-fit md:h-[44rem] overflow-y-auto items-start w-full relative rounded-b-xl always-visible-scrollbar',
				className,
			)}
			ref={gridRef}
		>
			<div className='grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 items-start mx-auto gap-10 pt-40 pb-40 md:px-10 px-4 mb-8'>
				{renderRepoList(
					displayedRepos.filter((_, index) => index % 2 === 0),
					translateFirst,
				)}
				{renderRepoList(
					displayedRepos.filter((_, index) => index % 2 !== 0),
					translateSecond,
				)}
			</div>
			{/* Show more button */}
			<div className='sticky bottom-0 left-0 right-0 backdrop-blur-[1px]'>
				<div className='h-28 bg-gradient-to-t from-background via-background/60 to-transparent'></div>
				{/* <div className='bg-background flex justify-center items-center h-12 px-7'>
					{showButton && visibleRepos < repos.length && (
						<button
							onClick={handleShowMore}
							className='rounded-xl border border-slate-300 bg-gradient-to-tl from-gray-100 to-gray-200 py-3 mb-20 px-5 text-foreground font-semibold text-sm hover:bg-gradient-to-tl hover:from-gray-200 hover:to-gray-300 dark:border-slate-700 dark:bg-gradient-to-tl dark:from-gray-900 dark:to-gray-800 hover:dark:bg-gradient-to-tl hover:dark:from-gray-800 hover:dark:to-gray-700'
						>
							Show More
						</button>
					)}
				</div> */}
			</div>
		</div>
	);
};
