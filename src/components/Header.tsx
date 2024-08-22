'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
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

const workSans = Work_Sans({ weight: '400', subsets: ['latin'] });
const jetBrainsMono = JetBrains_Mono({ weight: '400', subsets: ['latin'] });

const searchSchema = z.string().min(1, { message: 'Enter a valid username' });

export function Header({
	setUserData,
	setRepos,
	setLanguages,
	setTopContributingRepos,
	setUserName,
	setSearchedUser,
}: {
	setUserData: (data: any) => void;
	setRepos: (data: any) => void;
	setLanguages: (data: any) => void;
	setTopContributingRepos: (data: any) => void;
	setUserName: (data: any) => void;
	setSearchedUser: (data: string) => void;
}) {
	// Inside the Header component
	const [isSearchVisible, setIsSearchVisible] = useState(false);
	const [isInputFocused, setIsInputFocused] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const { toast } = useToast();
	const { setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	// const [isOverlayVisible, setIsOverlayVisible] = useState(false);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (isLoading) return; // Prevent submission if already loading

		const formData = new FormData(e.target as HTMLFormElement);
		const username = formData.get('search') as string;

		const validation = searchSchema.safeParse(username);
		if (!validation.success) {
			toast({
				variant: 'destructive',
				title: 'Username cannot be empty',
				description: validation.error.errors[0].message,
			});
			return;
		}

		setIsLoading(true);

		try {
			const userData = await fetchUser(username);
			console.log('Fetching user data...');

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
			if (userData.type === 'Organization') {
				toast({
					variant: 'notice',
					title: 'Organization Detected',
					description:
						'This app is optimized for individual GitHub suspects only. Please search for a personal username to investigate.',
				});
				setIsLoading(false);
				return;
			}

			const repos = await fetchRepos(username);
			if (repos.length === 0) {
				toast({
					variant: 'destructive',
					title: 'No repositories found',
					description:
						'This user has no public repositories. The app requires public repos to analyze.',
				});
				setIsLoading(false);
				return;
			}

			const topContributingRepos = await getTopContributingRepos(username);
			console.log('Fetching top contributing repositories...');

			const userStats = await getUserStats(username);
			console.log('Fetching user statistics...');

			console.log('Setting user data...');
			setUserData(userData);
			setRepos(repos);
			setLanguages(userStats);
			setTopContributingRepos(topContributingRepos);
			setUserName(userData?.name);
			setUserName(extractFirstName(userData?.name));
			setSearchedUser(username);

			console.log('Data fetching complete!');

			// Hide search overlay after successful search
			// hideSearch();
		} catch (error) {
			if (error instanceof Error) {
				if (error.message.includes('rate limit exceeded')) {
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

	useEffect(() => {
		if (isSearchVisible) {
			document.body.classList.add('no-scroll');
		} else {
			document.body.classList.remove('no-scroll');
		}
	}, [isSearchVisible]);

	if (!mounted) {
		return null;
	}

	//  refreshing the page when the logo is clicked
	const handleLogoClick = () => {
		window.location.reload();
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
				className={`flex justify-end md:justify-center mr-5 relative ${
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
					<Input
						id='search'
						name='search'
						placeholder='Search User'
						className={`py-0 px-3 rounded-tr-xl rounded-br-xl bg-transparent border-none focus:outline-none text-md lowercase placeholder:capitalize`}
						onFocus={handleInputFocus}
						onBlur={handleInputBlur}
						ref={inputRef}
					/>
					{/* Shortcut to open search */}
					{/* <span
						className={`flex absolute right-3 flex-row items-center text-muted-foreground ${
							isInputFocused ? 'hidden' : ''
						}`}
					>
						<CommandIcon size={12} />K
					</span> */}
					{isLoading && (
						<span className='absolute flex justify-center items-center space-x-2 top-14 left-0 text-muted-foreground animate-pulse w-full'>
							<span className='mt-2 text-sm animate-bounce'>🔍</span>
							{/* <ImSpinner2 className='animate-spin' size={20} /> */}
							<span>Loading...</span>
						</span>
					)}
				</form>
			</div>

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
