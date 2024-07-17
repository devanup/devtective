import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import GridBackGround from './ui/components/common/GridBackGround';

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
		<html lang='en'>
			<body className={`${inter.className}`}>
				<GridBackGround />
				{children}
			</body>
		</html>
	);
}
