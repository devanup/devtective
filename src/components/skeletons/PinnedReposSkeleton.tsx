import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gabarito } from 'next/font/google';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

const gabarito = Gabarito({
	weight: ['400'],
	subsets: ['latin'],
});

export function PinnedReposSkeleton() {
	const { theme, systemTheme } = useTheme();

	const [gradientOpacity, setGradientOpacity] = useState(0.3);
	useEffect(() => {
		const currentTheme = theme === 'system' ? systemTheme : theme;
		setGradientOpacity(currentTheme === 'dark' ? 0.1 : 0.5);
	}, [theme, systemTheme]);

	return (
		<Card className='flex flex-col space-y-4 bg-gray-100 rounded-xl p-6 animate-pulse'>
			<CardHeader
				className={`text-2xl text-center font-bold ${gabarito.className} text-slate-700 p-0`}
			>
				<span className='flex justify-center items-center space-x-2 dark:text-muted-foreground animate-pulse'>
					<span>Pinned Repositories</span>
				</span>
			</CardHeader>
			{[...Array(5)].map((_, index) => (
				<Card
					className='flex h-[70px] justify-between items-center rounded-xl shadow-none animate-pulse'
					key={index}
					style={{
						backgroundColor: 'rgba(2, 43, 70, 0.1)',
						backgroundImage: `radial-gradient(circle at -20% 90%, rgba(255, 255, 255, ${gradientOpacity}), rgba(123, 123, 123, 0.04)`,
					}}
				/>
			))}
		</Card>
	);
}
