import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Work_Sans } from 'next/font/google';
import { FaXTwitter } from 'react-icons/fa6';
import { PiMapPinFill } from 'react-icons/pi';
import { ImBriefcase } from 'react-icons/im';
import { LuLink2 } from 'react-icons/lu';
import { BsCalendar } from 'react-icons/bs';
import { UserDetailsSkeleton } from '../skeletons/UserDetailsSkeleton';
import { Suspense } from 'react';
import { UserData } from '@/types/user';

const workSans = Work_Sans({ weight: '400', subsets: ['latin'] });

function UserDetailsContent({ userData }: { userData: UserData }) {
	return (
		<Card
			className={`flex flex-col space-y-4 bg-gray-100 rounded-xl p-6 ${workSans.className} overflow-x-scroll`}
		>
			{/* Date joined */}
			{userData?.created_at && (
				<div className='flex w-full items-center space-x-3'>
					<div className='w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-100 bg-custom-rgba bg-custom-radial'>
						<BsCalendar className='w-5 h-5 mx-auto text-white ' />
					</div>
					<h3>
						Joined{' '}
						{new Date(userData.created_at).toLocaleString('en-US', {
							month: 'short',
							year: 'numeric',
						})}
					</h3>
				</div>
			)}
			{/* Location */}
			{userData?.location && (
				<div className='flex w-full items-center space-x-3'>
					<div className='w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-100 bg-custom-rgba bg-custom-radial'>
						<PiMapPinFill className='w-5 h-5 mx-auto text-white ' />
					</div>
					<h3>{userData.location}</h3>
				</div>
			)}
			{/* Company */}
			{userData?.company && (
				<div className='flex w-full items-center space-x-3'>
					<div className='w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-100 bg-custom-rgba bg-custom-radial'>
						<ImBriefcase className='w-5 h-5 mx-auto text-white ' />
					</div>
					<h3>
						{userData.company
							.replace(/^@/, '') // Remove the first '@' if it exists
							.replace(/@/g, ', ')}{' '}
						{/* Replace any remaining '@' symbols with ', ' */}
					</h3>
				</div>
			)}
			{/* Twitter */}
			{userData?.twitter_username && (
				<Link
					href={`https://twitter.com/${userData.twitter_username}`}
					target='_blank'
					className='w-fit'
				>
					<div className='flex w-full items-center space-x-3'>
						<div className='w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-100 bg-custom-rgba bg-custom-radial'>
							<FaXTwitter className='w-5 h-5 mx-auto text-white ' />
						</div>
						<h3>{userData.twitter_username}</h3>
					</div>
				</Link>
			)}

			{/* Blog */}
			{userData?.blog && (
				<Link
					href={
						userData.blog.startsWith('http://') ||
						userData.blog.startsWith('https://')
							? userData.blog
							: `https://${userData.blog}`
					}
					target='_blank'
					className='w-fit'
				>
					<div className='flex w-full items-center space-x-3'>
						<div className='w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-100 bg-custom-rgba bg-custom-radial'>
							<LuLink2 className='w-5 h-5 mx-auto text-white' />
						</div>
						<h3>
							{userData.blog
								.replace(/^https?:\/\//, '')
								.replace(/^www\./, '')
								.replace(/\/$/, '')}
						</h3>
					</div>
				</Link>
			)}
		</Card>
	);
}

export function UserDetailsCard({ userData }: { userData: UserData | null }) {
	return (
		<Suspense fallback={<UserDetailsSkeleton />}>
			{userData ? (
				<UserDetailsContent userData={userData} />
			) : (
				<UserDetailsSkeleton />
			)}
		</Suspense>
	);
}
