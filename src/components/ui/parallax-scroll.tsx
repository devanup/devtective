'use client';
import { MotionValue, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Repo } from '@/types/repo';
import { Card } from './card';
import { Button } from './button';
import { SiGithub } from 'react-icons/si';
import { abbreviateNumber } from 'js-abbreviation-number';
import { IoStar } from 'react-icons/io5';
import { BiGitRepoForked } from 'react-icons/bi';
import { FiChevronDown } from 'react-icons/fi';

interface ParallaxScrollProps {
	repos: Repo[];
	className?: string;
	visibleCount: number;
	setVisibleCount: (count: number) => void;
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

export const ParallaxScroll = ({
	repos,
	className,
	visibleCount,
	setVisibleCount,
}: ParallaxScrollProps) => {
	const gridRef = useRef<HTMLDivElement>(null);
	const [showButton, setShowButton] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	// Check if repos is an array and has items
	const validRepos = Array.isArray(repos) ? repos : [];
	const displayedRepos = validRepos.slice(0, visibleCount);
	const hasMore = validRepos.length > visibleCount;

	useEffect(() => {
		// Simulate loading delay
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 0);

		return () => clearTimeout(timer);
	}, []);

	// Detect when user has scrolled near the bottom
	useEffect(() => {
		const scrollContainer = gridRef.current;
		if (!scrollContainer) return;

		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
			const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

			// Show button when scrolled 85% or more (closer to bottom)
			setShowButton(scrollPercentage >= 0.85);
		};

		scrollContainer.addEventListener('scroll', handleScroll);
		// Check initial state
		handleScroll();

		return () => scrollContainer.removeEventListener('scroll', handleScroll);
	}, [displayedRepos.length]);

	const { scrollYProgress } = useScroll({
		container: gridRef,
		offset: ['start start', 'end start'],
	});

	const translateFirst = useTransform(scrollYProgress, [0, 1], [-150, -300]);
	const translateSecond = useTransform(scrollYProgress, [0, 1], [-150, 200]);

	const handleLoadMore = () => {
		setIsLoadingMore(true);
		// Simulate loading delay for better UX
		setTimeout(() => {
			setVisibleCount(visibleCount + 10);
			setIsLoadingMore(false);
		}, 500);
	};

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

	return (
		<div className='relative w-full'>
			<div
				className={cn(
					'h-[37rem] md:h-[46rem] overflow-y-auto items-start w-full relative rounded-b-xl always-visible-scrollbar',
					className,
				)}
				ref={gridRef}
			>
				<div className='pt-40 pb-0 xl:pb-96 md:px-10 px-4'>
					{/* Single column layout for mobile/tablet */}
					<div className='grid grid-cols-1 gap-10 xl:hidden'>
						{isLoading
							? Array(5)
									.fill(0)
									.map((_, idx) => (
										<motion.div
											style={{ y: translateFirst }}
											key={`skeleton-single-${idx}`}
										>
											<RepoCardSkeleton />
										</motion.div>
									))
							: displayedRepos.map((repo, idx) => (
									<motion.div
										style={{ y: translateFirst }}
										key={`repo-single-${idx}`}
									>
										<RepoCard repo={repo} />
									</motion.div>
							  ))}
					</div>

					{/* Two column layout for xl screens */}
					<div className='hidden xl:grid grid-cols-2 items-start mx-auto gap-10'>
						{renderRepoList(
							displayedRepos.filter((_, index) => index % 2 === 0),
							translateFirst,
						)}
						{renderRepoList(
							displayedRepos.filter((_, index) => index % 2 !== 0),
							translateSecond,
						)}
					</div>

					{/* Loading more skeleton */}
					{isLoadingMore && (
						<div className='grid grid-cols-1 xl:grid-cols-2 items-start mx-auto gap-10 mt-10'>
							<RepoCardSkeleton />
							<div className='hidden xl:block'>
								<RepoCardSkeleton />
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Gradient overlay - always visible at bottom */}
			<div className='absolute bottom-0 left-0 right-0 pointer-events-none'>
				<div className='h-32 bg-gradient-to-t from-background via-background/90 to-transparent flex items-end justify-center pb-6'>
					{/* Show more button - only visible when scrolled near bottom and has more repos */}
					{hasMore && !isLoadingMore && showButton && (
						<Button
							onClick={handleLoadMore}
							variant='outline'
							className='bg-background hover:bg-accent shadow-lg pointer-events-auto'
						>
							Show more
							<FiChevronDown className='ml-2' size={18} />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};
