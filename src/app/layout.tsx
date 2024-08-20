import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import GridBackGround from '../components/common/GridBackGround';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '../components/theme-provider';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Devtective',
	description:
		'Devtective app utilizes the GitHub API to fetch and display user data. The app offers a sleek and minimal interface to explore GitHub profiles, repositories, and activities. Discover, track, and analyze GitHub users with ease and precision.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body
				className={`${inter.className} transition-all ease-in-out duration-300`}
			>
				<ThemeProvider attribute='class' defaultTheme='system' enableSystem>
					<GridBackGround />
					{children}
				</ThemeProvider>
				<Toaster />
			</body>
		</html>
	);
}
