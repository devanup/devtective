'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CommandIcon, Moon, Search, Sun } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef, FormEvent } from 'react';

import { Work_Sans, JetBrains_Mono } from 'next/font/google';
import { Label } from '@/components/ui/label';
import { getUserData } from '@/app/actions/userData';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { BsFillMoonStarsFill } from 'react-icons/bs';
import { IoMdSunny } from 'react-icons/io';

const workSans = Work_Sans({ weight: '400', subsets: ['latin'] });
const jetBrainsMono = JetBrains_Mono({ weight: '400', subsets: ['latin'] });

const searchSchema = z.string().min(1, { message: 'Enter a valid username' });

export function Header({ setUserData }: { setUserData: (data: any) => void }) {
	// Inside the Header component
	const [isSearchVisible, setIsSearchVisible] = useState(false);
	const [isInputFocused, setIsInputFocused] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const { toast } = useToast();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const username = formData.get('search') as string;

		console.log('Form submitted with username:', username);

		const validation = searchSchema.safeParse(username);
		if (!validation.success) {
			toast({
				variant: 'destructive',
				title: 'Username cannot be empty',
				description: validation.error.errors[0].message,
			});
			return;
		}

		try {
			const userData = await getUserData(username);

			if (userData === undefined) {
				toast({
					variant: 'destructive',
					title: 'User not found',
					description: 'Please enter a valid username',
				});
				return;
			}

			setUserData(userData);

			// Hide search overlay after successful search
			hideSearch();
		} catch (error) {
			alert('An error occurred while fetching the user data');
		}
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
				document.body.classList.remove('no-scroll');
			}
		};

		// const handleKeyDown = (event: KeyboardEvent) => {
		// 	if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
		// 		event.preventDefault();
		// 		setIsSearchVisible(true);
		// 		setTimeout(() => {
		// 			inputRef.current?.focus();
		// 		}, 0);
		// 	}
		// };

		window.addEventListener('resize', handleResize);
		// window.addEventListener('keydown', handleKeyDown);

		// Cleanup event listener on component unmount
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
					className={`items-center justify-between md:bg-opacity-20 text-md py-1 pl-3 bg-gray-400/20 rounded-xl relative md:static  ${
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
						className={`py-0 px-3 rounded-tr-xl rounded-br-xl bg-transparent border-none focus:outline-none text-md lowercase placeholder:capitalize`}
						onFocus={handleInputFocus}
						onBlur={handleInputBlur}
						ref={inputRef}
					/>
					<span
						className={`flex absolute right-3 flex-row items-center text-muted-foreground ${
							isInputFocused ? 'hidden' : ''
						}`}
					>
						<CommandIcon size={12} />K
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
					<BsFillMoonStarsFill size={22} />
					{/* <IoMdSunny size={24} /> */}
				</Button>
			</div>
		</header>
	);
}
