import { JetBrains_Mono, Gabarito } from 'next/font/google';
import { LinkPreview } from '@/components/ui/link-preview';
import Image from 'next/image';
import {
	AvatarSkeleton,
	UserInfoSkeleton,
	LoadingFallback,
} from '../skeletons/UserAvatarSkeleton';
import { Suspense } from 'react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { UserData } from '@/types/user';
import { Repo } from '@/types/repo';
import { timeAgo, getMostRecentPushDate } from '@/lib/utils';

const jetBrainsMono = JetBrains_Mono({ weight: '400', subsets: ['latin'] });
const gabarito = Gabarito({ weight: ['400'], subsets: ['latin'] });

// Avatar image
function Avatar({ src }: { src: string }) {
	return (
		<div className='relative aspect-square w-[110px] md:w-[250px] mb-4 md:mb-0'>
			<Image
				src={src}
				alt='User avatar'
				fill
				className='object-cover rounded-xl bg-white bg-opacity-50 pointer-events-none'
			/>
		</div>
	);
}

// Name and username
function UserInfo({ name, login, lastActiveDate }: { name: string | null; login: string; lastActiveDate: string | null }) {
	const displayName = name || '';
	const isNameLong = displayName.length > 18;

	const NameComponent = isNameLong ? (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<h1
						className={`text-3xl font-bold ${gabarito.className} line-clamp-1 capitalize cursor-help`}
					>
						{displayName}
					</h1>
				</TooltipTrigger>
				<TooltipContent>
					<p>{displayName}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	) : (
		<h1
			className={`text-3xl font-bold ${gabarito.className} capitalize text-center md:text-left`}
		>
			{displayName}
		</h1>
	);

	return (
		<div className='flex flex-col space-y-2 w-full'>
			{NameComponent}
			<LinkPreview
				url={`https://github.com/${login}`}
				className={`text-xl text-muted-foreground w-fit ${jetBrainsMono.className} hover:text-gray-600 transition-colors duration-300 ease-in-out w-full md:w-fit`}
			>
				<div className='flex items-center justify-center text-lg dark:text-muted-foreground w-full'>
					<span>@{login}</span>
				</div>
			</LinkPreview>
			{/* Last active */}
			<div className='mt-2 flex items-center justify-center md:justify-start'>
				<span
					className={`inline-flex items-center gap-2 text-xs text-muted-foreground ${jetBrainsMono.className} opacity-70`}
				>
					{/* <span className='h-1.5 w-1.5 rounded-full bg-emerald-500' /> */}
					Last active: {lastActiveDate ? timeAgo(lastActiveDate) : 'unknown'}
				</span>
			</div>
		</div>
	);
}

function UserAvatarContent({ userData, repos }: { userData: UserData; repos: Repo[] }) {
	// Find the most recent push date from all repos
	const lastActiveDate = getMostRecentPushDate(repos);

	return (
		<div className='flex flex-col md:flex-row space-y-4 md:space-y-0 items-center md:space-x-6 space-x-0'>
			<Avatar src={userData.avatar_url} />
			<UserInfo name={userData.name} login={userData.login} lastActiveDate={lastActiveDate} />
		</div>
	);
}

export function UserAvatarCard({ userData, repos = [] }: { userData: UserData | null; repos?: Repo[] }) {
	return (
		<Suspense fallback={<LoadingFallback />}>
			{userData ? (
				<UserAvatarContent userData={userData} repos={repos} />
			) : (
				<LoadingFallback />
			)}
		</Suspense>
	);
}
