'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CommandIcon, Moon, Search, Sun } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef, FormEvent } from 'react';

import { Work_Sans, JetBrains_Mono } from 'next/font/google';
import { Label } from '@/components/ui/label';
import { getUserData } from '@/app/actions/userData';
import { getContributionData } from '@/app/actions/contributionData'; // Import the function

const workSans = Work_Sans({ weight: '400', subsets: ['latin'] });
const jetBrainsMono = JetBrains_Mono({ weight: '400', subsets: ['latin'] });

export function Header({
	setUserData,
	setContributionData, // Add this prop to pass contribution data
}: {
	setUserData: (data: any) => void;
	setContributionData: (data: any) => void; // Add this prop type
}) {
	// Inside the Header component
	const [isSearchVisible, setIsSearchVisible] = useState(false);
	const [isInputFocused, setIsInputFocused] = useState(false);
	const inputRef = useRef(null);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const username = formData.get('search') as string;

		const [userData, contributionData] = await Promise.all([
			getUserData(username),
			getContributionData(username),
		]);

		setUserData(userData);
		setContributionData(contributionData);
	};

	const handleInputFocus = () => {
		setIsInputFocused(true);
	};

	const handleInputBlur = () => {
		setIsInputFocused(false);
	};

	const toggleSearch = () => {
		setIsSearchVisible(!isSearchVisible);
	};

	const hideSearch = () => {
		setIsSearchVisible(false);
	};

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 768) {
				setIsSearchVisible(false);
				document.body.classList.remove('overflow-hidden');
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
				event.preventDefault();
				setIsSearchVisible(true);
				(inputRef.current as HTMLInputElement | null)?.focus();
			}
		};

		window.addEventListener('resize', handleResize);
		window.addEventListener('keydown', handleKeyDown);

		// Cleanup event listener on component unmount
		return () => {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	useEffect(() => {
		if (isSearchVisible) {
			document.body.classList.add('overflow-hidden');
		} else {
			document.body.classList.remove('overflow-hidden');
		}
	}, [isSearchVisible]);

	return (
		<header className='flex items-center justify-between mb-10 pt-8 w-full bg-gradient-to-b from-white to-transparent'>
			{/* bg-overlay for small screen */}
			{isSearchVisible && (
				<div
					className='absolute md:hidden w-full h-screen inset-0 bg-gradient-to-b from-white to-transparent rounded-none z-10 backdrop-blur-md'
					onClick={hideSearch}
				/>
			)}
			{/* Logo */}
			<Link href='' className='flex items-center space-x-3 relative'>
				<div
					className='w-[55px] h-[55px]'
					style={{
						backgroundImage: "url('/images/devtective-no-bg.png')",
						backgroundSize: 'contain',
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
					}}
				/>
				<span className={`text-lg absolute left-14 ${jetBrainsMono.className}`}>
					Dev
					<span className='text-accent-foreground/70'>tective</span>
				</span>
			</Link>
			{/* Search Input */}
			<div className='flex justify-center relative'>
				<form
					onSubmit={handleSubmit}
					className={`items-center justify-between bg-white md:bg-opacity-20 text-md pl-3 border-2 border-black/30 rounded-xl relative md:static  ${
						workSans.className
					} z-20 ${isSearchVisible ? 'flex' : 'hidden md:flex'} ${
						isInputFocused ? 'shadow-lg' : ''
					}`}
				>
					<Label htmlFor='search' className=''>
						<Search size={18} />
					</Label>
					<Input
						id='search'
						name='search'
						placeholder='Search User'
						className={`p-0 px-3 rounded-tr-xl rounded-br-xl bg-transparent border-none focus:outline-none text-md lowercase`}
						onFocus={handleInputFocus}
						onBlur={handleInputBlur}
						ref={inputRef}
					/>
					<span
						className={`flex absolute right-3  flex-row items-center text-muted-foreground ${
							isInputFocused ? 'hidden' : ''
						}`}
					>
						<CommandIcon size={12} /> K
					</span>
				</form>
			</div>
			<div className='flex items-center justify-center'>
				<Button
					className='md:hidden'
					variant={'link'}
					size={'icon'}
					onClick={toggleSearch}
				>
					<Search size={24} />
				</Button>
				<Button variant={'link'} size={'icon'}>
					<Moon size={24} />
					{/* <Sun size={24} /> */}
				</Button>
			</div>
		</header>
	);
}
