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

const workSans = Work_Sans({ weight: '400', subsets: ['latin'] });

function UserDetailsContent({ userData }: { userData: any }) {
	return (
		<Card
			className={`flex flex-col space-y-4 bg-gray-100 rounded-xl p-6 ${workSans.className} overflow-x-scroll`}
		>
			{/* Date joined */}
			<div className='flex w-full items-center space-x-3'>
				<div className='w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-100 bg-custom-rgba bg-custom-radial'>
					<BsCalendar className='w-5 h-5 mx-auto text-white ' />
				</div>
				<h3 className={!userData?.created_at ? 'text-muted-foreground' : ''}>
					{userData?.created_at
						? `Joined ${new Date(userData.created_at).toLocaleString('en-US', {
								month: 'short',
								year: 'numeric',
						  })}`
						: 'Date unknown'}
				</h3>
			</div>
			{/* Location */}
			<div className='flex w-full items-center space-x-3'>
				<div className='w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-100 bg-custom-rgba bg-custom-radial'>
					<PiMapPinFill className='w-5 h-5 mx-auto text-white ' />
				</div>
				<h3 className={!userData?.location ? 'text-muted-foreground' : ''}>
					{userData?.location ?? 'Location not listed'}
				</h3>
			</div>
			{/* Company */}
			<div className='flex w-full items-center space-x-3'>
				<div className='w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-100 bg-custom-rgba bg-custom-radial'>
					<ImBriefcase className='w-5 h-5 mx-auto text-white ' />
				</div>
				<h3 className={!userData?.company ? 'text-muted-foreground' : ''}>
					{userData?.company
						? userData.company
								.replace(/^@/, '') // Remove the first '@' if it exists
								.replace(/@/g, ', ') // Replace any remaining '@' symbols with ', '
						: 'Company not listed'}
				</h3>
			</div>
			{/* Twitter */}
			{userData?.twitter_username ? (
				<Link
					href={`https://twitter.com/${userData?.twitter_username}`}
					target='_blank'
					className='w-fit'
				>
					<div className='flex w-full items-center space-x-3'>
						<div className='w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-100 bg-custom-rgba bg-custom-radial'>
							<FaXTwitter className='w-5 h-5 mx-auto text-white ' />
						</div>
						<h3>{userData?.twitter_username}</h3>
					</div>
				</Link>
			) : (
				<div className='w-fit text-muted-foreground cursor-default'>
					<div className='flex w-full items-center space-x-3'>
						<div className='w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-100 bg-custom-rgba bg-custom-radial'>
							<FaXTwitter className='w-5 h-5 mx-auto text-white ' />
						</div>
						<h3>Username not listed</h3>
					</div>
				</div>
			)}

			{/* Blog */}
			{userData?.blog ? (
				<Link href={userData?.blog} target='_blank' className='w-fit'>
					<div className='flex w-full items-center space-x-3'>
						<div className='w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-100 bg-custom-rgba bg-custom-radial'>
							<LuLink2 className='w-5 h-5 mx-auto text-white' />
						</div>
						<h3>{userData?.blog}</h3>
					</div>
				</Link>
			) : (
				<div className='w-fit text-muted-foreground cursor-default'>
					<div className='flex w-full items-center space-x-3'>
						<div className='w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-100 bg-custom-rgba bg-custom-radial'>
							<LuLink2 className='w-5 h-5 mx-auto text-white' />
						</div>
						<h3>Website not listed</h3>
					</div>
				</div>
			)}
		</Card>
	);
}

export function UserDetailsCard({ userData }: { userData: any | null }) {
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
