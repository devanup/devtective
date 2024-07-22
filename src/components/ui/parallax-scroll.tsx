'use client';
import { useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const ParallaxScroll = ({
	images,
	className,
}: {
	images: string[];
	className?: string;
}) => {
	const gridRef = useRef<any>(null);
	const { scrollYProgress } = useScroll({
		container: gridRef, // remove this if your container is not fixed height
		offset: ['start start', 'end start'], // remove this if your container is not fixed height
	});

	const translateFirst = useTransform(scrollYProgress, [0, 1], [-150, -300]);
	const translateSecond = useTransform(scrollYProgress, [0, 1], [-150, 200]);
	const translateThird = useTransform(scrollYProgress, [0, 1], [-150, -300]);

	const third = Math.ceil(images.length / 3);

	const firstPart = images.slice(0, third);
	const secondPart = images.slice(third, 2 * third);
	const thirdPart = images.slice(2 * third);

	return (
		<div
			className={cn(
				'md:h-[40rem] items-start overflow-y-auto w-full',
				className,
			)}
			ref={gridRef}
		>
			<div
				className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start  max-w-5xl mx-auto gap-10 py-40 px-10'
				ref={gridRef}
			>
				<div className='grid gap-10'>
					{firstPart.map((el, idx) => (
						<motion.div
							style={{ y: translateFirst }} // Apply the translateY motion value here
							key={'grid-1' + idx}
						>
							<Link href=''>
								<div className='h-80 w-full object-cover object-left-top rounded-xl gap-10 !m-0 !p-0 bg-gray-200 hover:shadow-xl transition duration-200 shadow-input dark:shadow-none'>
									<div className='text-2xl font-bold text-gray-400 text-center'>
										{idx + 1}
									</div>
								</div>
							</Link>
						</motion.div>
					))}
				</div>
				<div className='grid gap-10'>
					{secondPart.map((el, idx) => (
						<motion.div style={{ y: translateSecond }} key={'grid-2' + idx}>
							<Link href=''>
								<div className='h-80 w-full object-cover object-left-top rounded-xl gap-10 !m-0 !p-0 bg-gray-200 hover:shadow-xl transition duration-200 shadow-input dark:shadow-none'>
									<div className='text-2xl font-bold text-gray-400 text-center'>
										{idx + 1}
									</div>
								</div>
							</Link>
						</motion.div>
					))}
				</div>
				<div className='grid gap-10'>
					{thirdPart.map((el, idx) => (
						<motion.div style={{ y: translateThird }} key={'grid-3' + idx}>
							<Link href=''>
								<div className='h-80 w-full object-cover object-left-top rounded-xl gap-10 !m-0 !p-0 bg-gray-200 hover:shadow-xl transition duration-200 shadow-input dark:shadow-none'>
									<div className='text-2xl font-bold text-gray-400 text-center'>
										{idx + 1}
									</div>
								</div>
							</Link>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
};
