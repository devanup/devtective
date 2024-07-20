import { Card } from '@/components/ui/card';
import Link from 'next/link';

import { Work_Sans } from 'next/font/google';
import { FaXTwitter } from 'react-icons/fa6';
import { PiMapPinFill } from 'react-icons/pi';
import { ImBriefcase } from 'react-icons/im';
import { LuLink2 } from 'react-icons/lu';

const workSans = Work_Sans({ weight: '400', subsets: ['latin'] });

export function UserDetailsCard({ userData }: { userData: any }) {
	return (
		<Card
			className={`flex flex-col space-y-4 bg-gray-100 rounded-xl p-6 ${workSans.className}`}
		>
			<div className='flex w-full items-center space-x-3'>
				<div className='w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-100 bg-custom-rgba bg-custom-radial'>
					<PiMapPinFill className='w-5 h-5 mx-auto text-white ' />
				</div>
				<h3 className={!userData?.location ? 'text-muted-foreground' : ''}>
					{userData?.location ?? 'Location not listed'}
				</h3>
			</div>
			<div className='flex w-full items-center space-x-3'>
				<div className='w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-100 bg-custom-rgba bg-custom-radial'>
					<ImBriefcase className='w-5 h-5 mx-auto text-white ' />
				</div>
				{/* <h3>Vercel</h3> */}
				<h3 className={!userData?.company ? 'text-muted-foreground' : ''}>
					{userData?.company
						? userData.company
								.replace(/^@/, '') // Remove the first '@' if it exists
								.replace(/@/g, ', ') // Replace any remaining '@' symbols with ', '
						: 'Company not listed'}
				</h3>
			</div>
			<Link
				href={
					userData?.twitter_username
						? `https://twitter.com/${userData?.twitter_username}`
						: ''
				}
				target='_blank'
				className={`${
					!userData?.twitter_username
						? 'text-muted-foreground cursor-default'
						: ''
				}  w-fit`}
			>
				<div className='flex w-full items-center space-x-3'>
					<div className='w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-100 bg-custom-rgba bg-custom-radial'>
						<FaXTwitter className='w-5 h-5 mx-auto text-white ' />
					</div>
					<h3>{userData?.twitter_username ?? 'Username not listed'}</h3>
				</div>
			</Link>
			<Link
				href={
					userData?.blog
						? userData?.blog
						: 'https://www.google.com/search?q=how+to+make+a+website'
				}
				target='_blank'
				className={`${
					!userData?.blog ? 'text-muted-foreground cursor-default' : ''
				}  w-fit`}
			>
				<div className='flex w-full items-center space-x-3'>
					<div className='w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-100 bg-custom-rgba bg-custom-radial'>
						<LuLink2 className='w-5 h-5 mx-auto text-white' />
					</div>
					<h3>
						{userData?.blog && userData?.blog !== ''
							? userData?.blog
							: 'Website not listed'}
					</h3>
				</div>
			</Link>
		</Card>
	);
}
