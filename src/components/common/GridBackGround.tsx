export default function GridBackGround() {
	return (
		// <div className='h-[100vh] w-full dark:bg-black bg-white  dark:bg-grid-white/[0.07] bg-grid-black/[0.07] flex items-center justify-center fixed -z-10'>
		<div className='h-[100vh] fixed -z-10 w-full dark:bg-black bg-white  dark:bg-grid-white/[0.1] bg-grid-black/[0.06] flex items-center justify-center'>
			{/* Radial gradient for the container to give a faded look */}
			<div className='absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-slate-950 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]' />
		</div>
	);
}
