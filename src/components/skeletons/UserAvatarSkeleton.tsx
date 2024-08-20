function AvatarSkeleton() {
	return (
		<div className='w-[110px] h-[110px] md:w-[170px] md:h-[170px] rounded-xl bg-gray-300 dark:bg-gray-700 animate-pulse' />
	);
}
function UserInfoSkeleton() {
	return (
		<div className='flex flex-col space-y-2'>
			{/* For name */}
			<div className='h-9 w-48 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse' />
			{/* For username */}
			<div className='h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse' />
		</div>
	);
}

export { AvatarSkeleton, UserInfoSkeleton };
