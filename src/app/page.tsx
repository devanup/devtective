'use client';
import { useState, useEffect, cache } from 'react';

import { UserData } from '@/types/user';
import { extractFirstName } from '@/utils/nameUtils';

import { Header } from '../components/Header';
import ProfileOverView from '@/components/ProfileOverview';
import RepoOverview from '@/components/RepoOverview';

import { fetchUser } from '@/lib/fetchUser';
import { fetchRepos } from '@/lib/fetchRepos';
import { getUserStats } from '@/lib/getLangData';
import { getTopContributingRepos } from '@/lib/getTopContributingRepos';

interface RateLimit {
	limit: number;
	remaining: number;
	used: number;
	reset: number;
}

interface DetailedRateLimit {
	user: RateLimit;
	repos: RateLimit;
	languages: RateLimit;
	topContributing: RateLimit;
}

const LoadingOverlay = ({ message }: { message: string }) => {
	return (
		<div className='fixed inset-0 flex items-center justify-center z-50 backdrop-blur-lg overflow-hidden'>
			<div className='text-center text-white'>
				<div className='mb-4 text-4xl animate-spin'>⏳</div>
				<p className='font-semibold text-black dark:text-white'>{message}</p>
			</div>
			<div className='bg-gradient-to-t inset-x-0 z-20 bottom-0 bg-white dark:bg-black h-full absolute [mask-image:radial-gradient(900px_at_center,transparent_30%,white)]' />
		</div>
	);
};

export default function Home() {
	const [userData, setUserData] = useState<UserData | null>(null);
	const [repos, setRepos] = useState<any[]>([]);
	const [languages, setLanguages] = useState<any[]>([]);
	const [topContributingRepos, setTopContributingRepos] = useState<any[]>([]);
	const [name, setName] = useState<string | null>(null);

	// Cache the fetchUser function
	const cachedFetchUser = cache(fetchUser);
	const cachedFetchRepos = cache(fetchRepos);
	const cachedGetUserStats = cache(getUserStats);
	const cachedGetTopContributingRepos = cache(getTopContributingRepos);

	const initialUsers = ['leerob', 'karpathy'];
	const [searchedUser, setSearchedUser] = useState<string>(() => {
		return initialUsers[Math.floor(Math.random() * initialUsers.length)];
	});

	const [loadingMessage, setLoadingMessage] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [detailedRateLimit, setDetailedRateLimit] =
		useState<DetailedRateLimit | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			setLoadingMessage('Initiating search...');

			try {
				setLoadingMessage('Loading user data...');
				const userDataResponse = await cachedFetchUser(searchedUser);
				// await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay between messages

				setLoadingMessage('Loading repositories...');
				const reposResponse = await cachedFetchRepos(searchedUser);
				// await new Promise((resolve) => setTimeout(resolve, 1000));

				setLoadingMessage('Loading language statistics...');
				const languagesResponse = await cachedGetUserStats(searchedUser);
				// await new Promise((resolve) => setTimeout(resolve, 1000));

				setLoadingMessage('Loading top contributing repositories...');
				const topContributingReposResponse =
					await cachedGetTopContributingRepos(searchedUser);

				setUserData(userDataResponse.user);
				setRepos(reposResponse.repos);
				// console.log('Number of repos => ', reposResponse.repos.length);
				setLanguages(languagesResponse.stats);
				setTopContributingRepos(topContributingReposResponse.repoActivities);

				setDetailedRateLimit({
					user: userDataResponse.rateLimit,
					repos: reposResponse.rateLimit,
					languages: languagesResponse.rateLimit,
					topContributing: topContributingReposResponse.rateLimit,
				});

				// console.log('detailedRateLimit=> ', detailedRateLimit);
				// console.log('userData rateLimit=> ', userDataResponse.rateLimit);
				// console.log('repos rateLimit=> ', reposResponse.rateLimit);
				// console.log('languages rateLimit=> ', languagesResponse.rateLimit);
				// console.log(
				// 	'topContributingRepos rateLimit=> ',
				// 	topContributingReposResponse.rateLimit,
				// );

				// Extract first name from userData.name
				const firstName = extractFirstName(userDataResponse.user?.name);
				setName(firstName);
				setLoadingMessage(''); // Clear the loading message
			} catch (error) {
				console.error('Error fetching data:', error);
				setLoadingMessage(''); // Clear the loading message
				alert('You have reached the rate limit. Please try again later.');
			} finally {
				setLoadingMessage('');
				setIsLoading(false);
			}
		};
		if (searchedUser) {
			fetchData();
		}
	}, [searchedUser]);

	return (
		<main className='px-5 md:px-8 pb-8 max-w-[1800px] mx-auto antialiased'>
			<Header
				setUserData={setUserData}
				setRepos={setRepos}
				setLanguages={setLanguages}
				setTopContributingRepos={setTopContributingRepos}
				setUserName={setName}
				setSearchedUser={setSearchedUser}
				detailedRateLimit={detailedRateLimit}
				initialUsers={initialUsers}
			/>
			{/* <MultiStepLoaderDemo /> */}
			{isLoading && <LoadingOverlay message={loadingMessage} />}
			<div className='flex lg:flex-row flex-col lg:space-x-12 space-x-0 lg:space-y-0 space-y-8 mt-12'>
				<ProfileOverView userData={userData} />
				<RepoOverview
					repos={repos}
					languages={languages}
					topContributingRepos={topContributingRepos}
					name={name}
					userName={searchedUser}
				/>{' '}
			</div>
		</main>
	);
}
