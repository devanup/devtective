import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CommandIcon, Moon, Search, Sun } from 'lucide-react';
import Link from 'next/link';

import { Work_Sans, JetBrains_Mono } from 'next/font/google';
import { Label } from '@/components/ui/label';

const workSans = Work_Sans({ weight: '400', subsets: ['latin'] });
const jetBrainsMono = JetBrains_Mono({ weight: '400', subsets: ['latin'] });

export function Header() {
	return (
		<header className='flex items-center justify-between mb-10 pt-8 w-full bg-gradient-to-b from-white to-transparent'>
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
				<span className={`text-xl absolute left-14 ${jetBrainsMono.className}`}>
					Devtective
				</span>
			</Link>
			<div className='flex justify-center relative'>
				<form
					className={`flex items-center relative justify-between bg-white bg-opacity-20 text-md pl-3 border-2 border-black/30 rounded-xl ${workSans.className}`}
				>
					<Label htmlFor='search' className=''>
						<Search size={18} />
					</Label>
					<Input
						id='search'
						placeholder='Search User'
						className={`p-0 px-3 rounded-tr-xl rounded-br-xl bg-transparent border-none focus:outline-none text-md`}
					/>
					{/* hide when a character is typed */}
					<span className='absolute right-3 flex flex-row items-center text-muted-foreground'>
						<CommandIcon size={12} />K
					</span>
				</form>
			</div>
			<div>
				<Button variant={'link'} size={'icon'}>
					<Moon size={24} />
					{/* <Sun size={24} /> */}
				</Button>
			</div>
		</header>
	);
}
