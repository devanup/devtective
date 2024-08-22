function AvatarSkeleton() {
	return (
		<div className='aspect-square w-[110px] md:w-[250px] mb-4 md:mb-0 rounded-xl bg-gray-300 dark:bg-gray-700 animate-pulse' />
	);
}

function UserInfoSkeleton() {
	return (
		<div className='flex flex-col space-y-2 w-full items-center md:items-start'>
			{/* For name */}
			<div className='h-9 w-48 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse' />
			{/* For username */}
			<div className='h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse' />
		</div>
	);
}

function LoadingFallback() {
	return (
		<div className='flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6'>
			<AvatarSkeleton />
			<UserInfoSkeleton />
		</div>
	);
}

export { AvatarSkeleton, UserInfoSkeleton, LoadingFallback };
