'use client';

import useLocalStorage from '@/hooks/useLocalStorage';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUpRight, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef, FormEvent } from 'react';
import { useTheme } from 'next-themes';
import { Work_Sans, JetBrains_Mono } from 'next/font/google';
import { Label } from '@/components/ui/label';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { BsFillMoonStarsFill } from 'react-icons/bs';
import { IoMdSunny } from 'react-icons/io';
import { fetchUser } from '@/lib/fetchUser';
import { fetchRepos } from '@/lib/fetchRepos';
import { getTopContributingRepos } from '@/lib/getTopContributingRepos';
import { getUserStats } from '@/lib/getLangData';
import { extractFirstName } from '@/utils/nameUtils';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from './ui/tooltip';
import { abbreviateNumber } from 'js-abbreviation-number';

const workSans = Work_Sans({ weight: '400', subsets: ['latin'] });
const jetBrainsMono = JetBrains_Mono({ weight: '400', subsets: ['latin'] });

const searchSchema = z.string().min(1, { message: 'Enter a valid username' });

const CircularLoadingBar = ({
	remaining,
	limit,
}: {
	remaining: number;
	limit: number;
}) => {
	const radius = 18;
	const circumference = 2 * Math.PI * radius;
	const percentage = Math.round((remaining / limit) * 100);
	const fillPercentage = (100 - percentage) / 100;

	const getColor = (percentage: number) => {
		if (percentage > 50) return 'stroke-green-500';
		if (percentage > 20) return 'stroke-yellow-500';
		return 'stroke-red-500';
	};

	const color = getColor(percentage);

	return (
		<div className=' cursor-pointer relative size-10 group opacity-65 hover:opacity-100 transition-all ease-in-out duration-200 ml-2'>
			<svg className='w-full h-full' viewBox='0 0 40 40'>
				<circle
					className='text-gray-400 opacity-55'
					strokeWidth='4'
					stroke='currentColor'
					fill='transparent'
					r={radius}
					cx='20'
					cy='20'
				/>
				<circle
					className={`transition-all duration-300 ease-in-out ${color}`}
					strokeWidth='4'
					strokeDasharray={circumference}
					strokeDashoffset={fillPercentage * circumference}
					strokeLinecap='round'
					fill='transparent'
					r={radius}
					cx='20'
					cy='20'
					style={{
						transform: 'rotate(-90deg)',
						transformOrigin: '50% 50%',
					}}
				/>
			</svg>
			<div className='absolute inset-0 flex items-center justify-center'>
				<span className='!text-[.8rem] font-semibold'>
					{abbreviateNumber(remaining)}
				</span>
			</div>
		</div>
	);
};

interface RateLimit {
	limit: number;
	remaining: number;
	used: number;
	reset: number;
}

interface DetailedRateLimit {
	user: RateLimit;
	repos: RateLimit;
	languages: RateLimit;
	topContributing: RateLimit;
}

export function Header({
	setUserData,
	setRepos,
	setLanguages,
	setTopContributingRepos,
	setUserName,
	setSearchedUser,
	initialUsers,
	detailedRateLimit,
}: {
	setUserData: (data: any) => void;
	setRepos: (data: any) => void;
	setLanguages: (data: any) => void;
	setTopContributingRepos: (data: any) => void;
	setUserName: (data: any) => void;
	setSearchedUser: (data: string) => void;
	initialUsers: string[];
	detailedRateLimit: DetailedRateLimit | null;
}) {
	// Inside the Header component
	const [isSearchVisible, setIsSearchVisible] = useState(false);
	const [isInputFocused, setIsInputFocused] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const { toast } = useToast();
	const { setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [statusMessage, setStatusMessage] = useState('');
	// const [isOverlayVisible, setIsOverlayVisible] = useState(false);

	const [apiCallsMade, setApiCallsMade] = useLocalStorage<any>(
		'apiCallsMade',
		0,
	);
	const [lastResetTime, setLastResetTime] = useLocalStorage<number>(
		'lastResetTime',
		Date.now(),
	);

	// useEffect(() => {
	// 	if (rateLimit) {
	// 		const usage = Math.round((rateLimit.remaining / rateLimit.limit) * 100);
	// 		setApiUsage(usage);
	// 	}
	// 	console.log('rateLimit(HEADER)=> ', rateLimit);
	// 	console.log('apiUsage(HEADER)=> ', apiUsage);
	// }, [rateLimit]);
	const [lastSearchedUser, setLastSearchedUser] = useState<string | null>(
		initialUsers[0],
	);

	const [isRateLimitWarning, setIsRateLimitWarning] = useState(false);

	const [isTooltipVisible, setIsTooltipVisible] = useState(false);

	const isCacheValid = (username: string) => {
		const cachedData = localStorage.getItem(`userData_${username}`);
		if (!cachedData) return false;
		const { timestamp } = JSON.parse(cachedData);
		return Date.now() - timestamp < 2 * 60 * 60 * 1000; // 2 hours
	};

	const updateApiCalls = () => {
		if (Date.now() - lastResetTime > 60 * 60 * 1000) {
			setApiCallsMade(0);
			setLastResetTime(Date.now());
		} else {
			setApiCallsMade((prev: number) => prev + 1);
		}
	};

	// Function to check if we're close to exceeding the rate limit
	const isCloseToRateLimit = (limit: RateLimit) => {
		return limit.remaining <= 6; // Warn when 5 or fewer requests remain
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (isLoading) return; // Prevent submission if already loading

		const formData = new FormData(e.target as HTMLFormElement);
		const username = formData.get('search') as string;

		if (!isCacheValid(username)) {
			updateApiCalls();
		}

		const validation = searchSchema.safeParse(username);
		if (!validation.success) {
			toast({
				variant: 'destructive',
				title: 'Username cannot be empty',
				description: validation.error.errors[0].message,
			});
			return;
		}

		// Check if we're close to the rate limit
		const lowestLimit = getLowestLimit();
		if (isCloseToRateLimit(lowestLimit)) {
			setIsRateLimitWarning(true);
			toast({
				variant: 'destructive',
				title: 'Rate Limit Warning',
				description: `You're close to exceeding the API rate limit. Please wait before making more requests.`,
			});
			return;
		}
		// Check if the current search is the same as the last search
		if (username === lastSearchedUser) {
			// toast({
			// 	variant: 'default',
			// 	title: 'Already searched',
			// 	description: `You've already searched for ${username}. Try a different user.`,
			// });
			return;
		}

		setIsRateLimitWarning(false);
		setIsLoading(true);
		setStatusMessage('Initiating search...');

		try {
			const updateStatus = async (message: string) => {
				setStatusMessage(message);
				await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for 500ms
			};

			await updateStatus('Fetching user data...');

			const userData = await fetchUser(username);

			if (userData === undefined) {
				toast({
					variant: 'destructive',
					title: 'User not found',
					description: 'Please enter a valid username',
				});
				setIsLoading(false);
				return;
			}
			// Check if the entity is an organization
			if (userData.user.type === 'Organization') {
				toast({
					variant: 'notice',
					title: 'Organization Detected',
					description:
						'This app is optimized for individual GitHub suspects only. Please search for a personal username to investigate.',
				});
				setIsLoading(false);
				return;
			}

			await updateStatus('Fetching repositories...');
			const repos = await fetchRepos(username);
			if (repos.repos.length === 0) {
				toast({
					variant: 'destructive',
					title: 'No repositories found',
					description:
						'This user has no public repositories. The app requires public repos to analyze.',
				});
				setIsLoading(false);
				return;
			}

			await updateStatus('Fetching top contributing repositories...');
			// console.log('Fetching top contributing repositories...');
			const topContributingRepos = await getTopContributingRepos(username);

			await updateStatus('Fetching user statistics...');
			// console.log('Fetching user statistics...');
			const userStats = await getUserStats(username);

			await updateStatus('Setting user data...');
			// console.log('Setting user data...');
			setUserData(userData);
			setRepos(repos);
			setLanguages(userStats);
			setTopContributingRepos(topContributingRepos);
			setUserName(userData?.user?.name);
			setUserName(extractFirstName(userData?.user?.name));
			setSearchedUser(username);
			setLastSearchedUser(username);

			await updateStatus('Data fetching complete!');
			// console.log('Data fetching complete!');

			// Hide search overlay after successful search
			// hideSearch();
		} catch (error) {
			if (error instanceof Error) {
				console.log('error(HEADER)=> ', error);
				if (error.message.includes('rate limit')) {
					if (error.message.includes('secondary rate limit')) {
						toast({
							variant: 'destructive',
							title: 'API Rate Limit Exceeded',
							description:
								'You have exceeded a secondary rate limit. Please wait a few minutes before you try again.',
						});
					} else {
						toast({
							variant: 'destructive',
							title: 'API Rate Limit Exceeded',
							description: 'Please wait a few minutes before you try again.',
						});
					}
				} else if (error.message.includes('Not Found')) {
					toast({
						variant: 'destructive',
						title: 'User Not Found',
						description: 'Please check the username and try again.',
					});
				} else {
					console.error('An unexpected error occurred:', error);
					toast({
						variant: 'destructive',
						title: 'Error',
						description: 'An unexpected error occurred. Please try again.',
					});
				}
			} else {
				console.error('An unexpected error occurred:', error);
				toast({
					variant: 'destructive',
					title: 'Error',
					description: 'An unexpected error occurred. Please try again.',
				});
			}
		} finally {
			setIsLoading(false);
			setStatusMessage('');
			hideSearch();
		}
	};

	const handleInputFocus = () => {
		setIsInputFocused(true);
		// setIsOverlayVisible(true);
	};

	const handleInputBlur = () => {
		setIsInputFocused(false);
		if (!isLoading) {
			// setIsOverlayVisible(false);
		}
	};

	const toggleSearch = () => {
		setIsSearchVisible(!isSearchVisible);
		// setIsOverlayVisible(!isSearchVisible);
	};

	const hideSearch = () => {
		setIsSearchVisible(false);
		// setIsOverlayVisible(false);
	};

	const [windowWidth, setWindowWidth] = useState(
		typeof window !== 'undefined' ? window.innerWidth : 0,
	);

	useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// handling screen resize for small screens
	useEffect(() => {
		setMounted(true);

		const handleResize = () => {
			if (window.innerWidth >= 768) {
				setIsSearchVisible(false);
				document.body.classList.remove('no-scroll');
			}
		};
		/*
		const handleKeyDown = (event: KeyboardEvent) => {
			if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
				event.preventDefault();
				setIsSearchVisible(true);
				setTimeout(() => {
					inputRef.current?.focus();
				}, 0);
			}
		};
*/
		window.addEventListener('resize', handleResize);
		// window.addEventListener('keydown', handleKeyDown);

		// Cleaning up event listener on component unmount
		return () => {
			window.removeEventListener('resize', handleResize);
			// window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	// handling the search overlay on small screens
	useEffect(() => {
		if (isSearchVisible) {
			document.body.classList.add('no-scroll');
		} else {
			document.body.classList.remove('no-scroll');
		}
	}, [isSearchVisible]);

	// if the component is not mounted, return null
	if (!mounted) {
		return null;
	}

	//  refreshing the page when the logo is clicked
	const handleLogoClick = () => {
		window.location.reload();
	};

	const getRateLimitTooltipContent = () => {
		if (!detailedRateLimit) return 'No rate limit data available';

		const getLimitStatus = (remaining: number, limit: number) => {
			const percentage = (remaining / limit) * 100;
			if (percentage > 50) return 'text-green-500';
			if (percentage > 20) return 'text-yellow-500';
			return 'text-red-500';
		};

		const limits = [
			{ name: 'User', ...detailedRateLimit.user },
			{ name: 'Repos', ...detailedRateLimit.repos },
			{ name: 'Languages', ...detailedRateLimit.languages },
			{ name: 'Top Contributing', ...detailedRateLimit.topContributing },
		];

		const lowestLimit = limits.reduce((min, current) =>
			current.remaining / current.limit < min.remaining / min.limit
				? current
				: min,
		);

		return (
			<div className='p-3'>
				<h1 className='text-lg font-semibold flex flex-col mb-2'>
					API Rate Limits{' '}
					<Link
						href='https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2022-11-28'
						target='_blank'
						className='text-accent-foreground/70 flex items-center space-x-1'
					>
						<span className='text-accent-foreground/70 flex items-center text-xs'>
							Learn more <ArrowUpRight size={16} />
						</span>
					</Link>
				</h1>
				<p
					className={`text-sm font-bold ${getLimitStatus(
						lowestLimit.remaining,
						lowestLimit.limit,
					)}`}
				>
					{lowestLimit.remaining} requests remaining
				</p>
				<p className='text-xs text-muted-foreground mb-2'>
					Lowest limit shown
					<br />
					Cached data (2h) may affect displayed values
				</p>

				<hr className='my-3' />
				<div className='text-xs space-y-1'>
					{limits.map((limit) => (
						<p
							key={limit.name}
							className={
								limit === lowestLimit
									? 'font-semibold'
									: 'text-muted-foreground'
							}
						>
							{limit.name}: {limit.remaining}/{limit.limit}
						</p>
					))}
				</div>
			</div>
		);
	};

	const getLowestLimit = () => {
		if (!detailedRateLimit)
			return { remaining: 100, limit: 100, used: 0, reset: 0 };
		return Object.values(detailedRateLimit).reduce((min, current) =>
			current.remaining / current.limit < min.remaining / min.limit
				? current
				: min,
		);
	};

	return (
		<header
			className={`flex items-center justify-between pt-8 w-full bg-gradient-to-b ${
				resolvedTheme === 'dark'
					? 'from-black/50 to-transparent'
					: 'from-white to-transparent'
			}`}
		>
			{/* bg-overlay for small screen */}
			{/* {isOverlayVisible && (
				<div
					className='absolute md:hidden w-full h-screen inset-0 bg-gradient-to-b dark:from-black/50 from-white to-transparent rounded-none z-10 backdrop-blur-md'
					onClick={handleOverlayClick}
				/>
			)} */}

			{/* Logo */}
			<Link
				href=''
				className={`flex items-center space-x-3 relative transition-all ease-in-out duration-200 ${
					isSearchVisible ? 'opacity-50 blur-md pointer-events-none' : ''
				}`}
				onClick={handleLogoClick}
			>
				<div
					className='w-[55px] h-[55px]'
					style={{
						backgroundImage: "url('/images/devtective-no-bg.png')",
						backgroundSize: 'contain',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
					}}
				/>
				<span
					className={`text-lg absolute left-14 ${jetBrainsMono.className} ${
						isSearchVisible ? 'hidden' : ''
					}`}
				>
					Dev
					<span className={`text-accent-foreground/70`}>tective</span>
				</span>
			</Link>
			{/* Search Input */}
			<div
				className={`flex justify-end items-center space-x-2 md:justify-center mr-5 relative ${
					isSearchVisible ? 'w-full' : ''
				}`}
			>
				<form
					onSubmit={handleSubmit}
					className={`items-center justify-between md:bg-opacity-20 text-md py-1 pl-3 bg-gray-400/20 rounded-xl relative md:static  ${
						workSans.className
					} z-20 ${isSearchVisible ? 'flex ' : 'hidden md:flex'} ${
						isInputFocused ? 'md:shadow-lg shadow-none' : ''
					}`}
				>
					<Label htmlFor='search' className=''>
						<Search size={18} />
					</Label>
					{/* disable the input if apiUsage is less than or equal to 5% */}
					<Input
						id='search'
						name='search'
						placeholder={
							isRateLimitWarning ? 'Rate limit nearly exceeded' : 'Search User'
						}
						className={`py-0 px-3 rounded-tr-xl rounded-br-xl bg-transparent border-none focus:outline-none text-md lowercase placeholder:capitalize ${
							isRateLimitWarning ? 'border-yellow-500' : ''
						}`}
						onFocus={handleInputFocus}
						onBlur={handleInputBlur}
						ref={inputRef}
						// disabled={apiUsage <= 5}
					/>
					{/* Shortcut to open search */}
					{/* <span
						className={`flex absolute right-3 flex-row items-center text-muted-foreground ${
							isInputFocused ? 'hidden' : ''
						}`}
					>
						<CommandIcon size={12} />K
					</span> */}

					{(isLoading || statusMessage) && (
						<span className='absolute flex justify-center items-center space-x-2 top-14 left-0 text-muted-foreground animate-pulse w-full'>
							<span className='mt-2 text-sm animate-bounce'>🔍</span>
							<span>{statusMessage || 'Loading...'}</span>
						</span>
					)}
				</form>
				{(isSearchVisible || window.innerWidth >= 768) && (
					<TooltipProvider>
						<Tooltip open={isTooltipVisible}>
							<TooltipTrigger asChild>
								<div
									onMouseEnter={() => setIsTooltipVisible(true)}
									onMouseLeave={() => setIsTooltipVisible(false)}
									onClick={() => setIsTooltipVisible(!isTooltipVisible)}
								>
									<CircularLoadingBar {...getLowestLimit()} />
								</div>
							</TooltipTrigger>
							<TooltipContent
								onMouseEnter={() => setIsTooltipVisible(true)}
								onMouseLeave={() => setIsTooltipVisible(false)}
								className='mt-0 md:-mt-1 md:mr-0 mr-12'
							>
								{getRateLimitTooltipContent()}
								{isRateLimitWarning && (
									<p className='text-xs text-yellow-500'>
										Close to rate limit. Please wait before making more
										requests.
									</p>
								)}
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</div>

			{/* Search and Theme Toggle for small screen */}
			<div className='flex items-center justify-center'>
				<Button
					className='md:hidden'
					variant={'link'}
					size={'icon'}
					onClick={toggleSearch}
				>
					{isSearchVisible ? (
						<X size={24} onClick={hideSearch} />
					) : (
						<Search size={24} />
					)}
				</Button>
				{/* Theme Toggle */}
				<Button
					variant={'link'}
					size={'icon'}
					onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
					className={` transition-all ease-in-out duration-200 ${
						isSearchVisible ? 'opacity-90 blur-sm pointer-events-none' : ''
					}`}
				>
					{resolvedTheme === 'dark' ? (
						<BsFillMoonStarsFill size={22} className='text-muted-foreground' />
					) : (
						<IoMdSunny size={24} className='text-muted-foreground' />
					)}
				</Button>
			</div>
		</header>
	);
}
