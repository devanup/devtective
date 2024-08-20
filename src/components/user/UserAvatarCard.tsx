import { JetBrains_Mono, Gabarito } from 'next/font/google';
import { LinkPreview } from '@/components/ui/link-preview';
import Image from 'next/image';
import {
	AvatarSkeleton,
	UserInfoSkeleton,
} from '../skeletons/UserAvatarSkeleton';
import { Suspense } from 'react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

const jetBrainsMono = JetBrains_Mono({ weight: '400', subsets: ['latin'] });
const gabarito = Gabarito({ weight: ['400'], subsets: ['latin'] });

interface UserData {
	avatar_url: string;
	name: string;
	login: string;
}

// Avatar image
function Avatar({ src }: { src: string }) {
	return (
		<div className='relative w-[110px] h-[110px] md:w-[170px] md:h-[170px]'>
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
function UserInfo({ name, login }: { name: string | null; login: string }) {
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
		<h1 className={`text-3xl font-bold ${gabarito.className} capitalize`}>
			{displayName}
		</h1>
	);

	return (
		<div className='flex flex-col space-y-2'>
			{NameComponent}
			<LinkPreview
				url={`https://github.com/${login}`}
				className={`text-xl text-muted-foreground w-fit ${jetBrainsMono.className} hover:text-gray-600 transition-colors duration-300 ease-in-out`}
			>
				<div className='flex items-center text-lg dark:text-muted-foreground'>
					<span>@{login}</span>
				</div>
			</LinkPreview>
		</div>
	);
}

function LoadingFallback() {
	return (
		<div className='flex items-center space-x-6'>
			<AvatarSkeleton />
			<UserInfoSkeleton />
		</div>
	);
}

function UserAvatarContent({ userData }: { userData: UserData }) {
	return (
		<div className='flex items-center space-x-6'>
			<Avatar src={userData.avatar_url} />
			<UserInfo name={userData.name} login={userData.login} />
		</div>
	);
}

export function UserAvatarCard({ userData }: { userData: UserData | null }) {
	return (
		<Suspense fallback={<LoadingFallback />}>
			{userData ? (
				<UserAvatarContent userData={userData} />
			) : (
				<LoadingFallback />
			)}
		</Suspense>
	);
}
