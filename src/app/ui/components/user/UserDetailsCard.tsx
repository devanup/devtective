import { Card } from '@/components/ui/card';
import {
	BriefcaseBusiness,
	Link as LucideLink,
	Mail,
	MapPin,
} from 'lucide-react';

import Link from 'next/link';

import { Work_Sans } from 'next/font/google';

const workSans = Work_Sans({ weight: '400', subsets: ['latin'] });

export function UserDetailsCard() {
	return (
		<Card
			className={`flex flex-col space-y-4 bg-gray-100 rounded-xl p-6 ${workSans.className}`}
		>
			<div className='flex w-full items-center space-x-3'>
				<div className='w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-100 bg-custom-rgba bg-custom-radial'>
					<BriefcaseBusiness className='w-6 h-6 mx-auto text-white stroke-[.1em]' />
				</div>
				<h3>Vercel</h3>
			</div>
			<div className='flex w-full items-center space-x-3'>
				<div className='w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-100 bg-custom-rgba bg-custom-radial'>
					<MapPin className='w-6 h-6 mx-auto text-white stroke-[.1em]' />
				</div>
				<h3>Des Moines, IA</h3>
			</div>
			<Link href='' className='w-fit'>
				<div className='flex w-full items-center space-x-3'>
					<div className='w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-100 bg-custom-rgba bg-custom-radial'>
						<Mail className='w-6 h-6 mx-auto text-white stroke-[.1em]' />
					</div>
					<h3>me@leerob.io</h3>
				</div>
			</Link>
			<Link href='' className='w-fit'>
				<div className='flex w-full items-center space-x-3'>
					<div className='w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-100 bg-custom-rgba bg-custom-radial'>
						<LucideLink className='w-6 h-6 mx-auto text-white stroke-[.1em]' />
					</div>
					<h3>https://leerob.io</h3>
				</div>
			</Link>
		</Card>
	);
}
