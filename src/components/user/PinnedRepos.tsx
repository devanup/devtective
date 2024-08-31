import { Suspense, useEffect, useState } from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Gabarito, Work_Sans, JetBrains_Mono } from 'next/font/google';
import { Star } from 'lucide-react';
// import { getPinnedRepos } from '@/app/actions/pinnedRepos';
import { getPinnedRepos } from '@/lib/getPinnedRepos';
import { IPinnedRepo } from 'get-pinned-repos';
import { abbreviateNumber } from 'js-abbreviation-number';
import { PinnedReposSkeleton } from '../skeletons/PinnedReposSkeleton';

const workSans = Work_Sans({ weight: '400', subsets: ['latin'] });
const jetBrainsMono = JetBrains_Mono({ weight: '400', subsets: ['latin'] });

const gabarito = Gabarito({
	weight: ['400'],
	subsets: ['latin'],
});

const MAX_LANGUAGE_CHARACTERS = 25; // Adjust this value based on UI requirements

function PinnedReposContent({ userData }: { userData: any }) {
	const [pinnedRepos, setPinnedRepos] = useState<IPinnedRepo[] | null>(null);
	const { theme, systemTheme } = useTheme();
	const [gradientOpacity, setGradientOpacity] = useState(0.5);

	useEffect(() => {
		const currentTheme = theme === 'system' ? systemTheme : theme;
		setGradientOpacity(currentTheme === 'dark' ? 0.1 : 0.5);
	}, [theme, systemTheme]);

	useEffect(() => {
		const fetchPinnedRepos = async () => {
			try {
				const data = await getPinnedRepos(userData.login);
				setPinnedRepos(data || []);
			} catch (error) {
				setPinnedRepos([]);
			}
		};

		fetchPinnedRepos();
	}, [userData?.login]); // Dependency array to refetch when userData.login changes

	const getDisplayLanguages = (languages: IPinnedRepo['languages']) => {
		let totalLength = 0;
		const displayLanguages = [];

		for (const language of languages ?? []) {
			// avoiding line break in the UI
			if (totalLength + language.name.length <= MAX_LANGUAGE_CHARACTERS) {
				displayLanguages.push(language.name);
				totalLength += language.name.length + 2;
			} else {
				displayLanguages.push(`and more`);
				break;
			}
		}

		return displayLanguages;
	};

	if (pinnedRepos === null) {
		return <PinnedReposSkeleton />;
	}

	return (
		<Card
			className={`flex flex-col space-y-4 bg-gray-100 rounded-xl p-6 ${workSans.className}`}
		>
			<CardHeader
				className={`text-2xl text-center font-bold ${gabarito.className} text-slate-700 p-0`}
			>
				<span className='flex justify-center items-center space-x-2 dark:text-muted-foreground'>
					<span>Pinned Repositories</span>
				</span>
			</CardHeader>
			{pinnedRepos.length === 0 ? (
				<h1 className='text-center text-muted-foreground py-6'>
					No pinned repositories found
				</h1>
			) : (
				pinnedRepos.map((repo) => (
					<Link key={repo.id} href={repo.url} className='group' target='_blank'>
						<Card
							className='flex justify-between items-center p-4 rounded-xl shadow-none border-gray-300 relative bottom-0 transition-all ease-in-out duration-200 hover:bottom-1 hover:shadow-md'
							style={{
								backgroundColor: 'rgba(2, 43, 70, 0.1)',
								backgroundImage: `radial-gradient(circle at -20% 90%, rgba(255, 255, 255, ${gradientOpacity}), rgba(123, 123, 123, 0.04)`,
							}}
						>
							{/* Repo name and languages */}
							<div className='flex items-center space-x-3'>
								<div className='flex flex-col'>
									<span className='flex items-center transition-all ease-in-out duration-200'>
										<span className='line-clamp-1'>{repo?.name}</span>
									</span>
									<span
										className={`text-muted-foreground text-xs flex ${jetBrainsMono.className}`}
									>
										{getDisplayLanguages(repo.languages).join(', ')}
									</span>
								</div>
							</div>
							{/* Star gazer count */}
							<div className='flex space-x-1 items-center uppercase ml-2'>
								<div>
									<Star className='w-5 h-5 mx-auto text-transparent fill-black/50 dark:fill-white/50' />
								</div>
								<span>{abbreviateNumber(parseInt(repo.stargazerCount))}</span>
							</div>
						</Card>
					</Link>
				))
			)}
		</Card>
	);
}

export function PinnedRepos({ userData }: { userData: any }) {
	return (
		<Suspense fallback={<PinnedReposSkeleton />}>
			{userData ? (
				<PinnedReposContent userData={userData} />
			) : (
				<PinnedReposSkeleton />
			)}
		</Suspense>
	);
}
