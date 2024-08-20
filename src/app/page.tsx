'use client';

import { useState, useEffect } from 'react';
import ProfileOverView from '@/components/ProfileOverview';
import RepoOverview from '@/components/RepoOverview';
import { Header } from '../components/Header';
import { fetchUser } from '@/lib/fetchUser';
import { fetchRepos } from '@/lib/fetchRepos';
import { getUserStats } from '@/lib/getLangData';
import { extractFirstName } from '@/utils/nameUtils';
import { UserData } from '@/types/user';

export default function Home() {
	const [userData, setUserData] = useState<UserData | null>(null);
	const [repos, setRepos] = useState<any[]>([]);
	const [languages, setLanguages] = useState<any[]>([]);
	const [topContributingRepos, setTopContributingRepos] = useState<any[]>([]);
	const [name, setName] = useState<string | null>(null);
	const [searchedUser, setSearchedUser] = useState<string>('leerob');

	useEffect(() => {
		const fetchData = async () => {
			const [userData, repos, languages] = await Promise.all([
				fetchUser(searchedUser),
				fetchRepos(searchedUser),
				getUserStats(searchedUser),
			]);
			setUserData(userData);
			setRepos(repos);
			setLanguages(languages as any[]);

			// Extracting the first name from userData.name
			const firstName = extractFirstName(userData?.name);
			setName(firstName);
		};
		fetchData();
	}, [searchedUser]);

	return (
		<main className='px-8 pb-8 max-w-[1800px] mx-auto antialiased'>
			<Header
				setUserData={setUserData}
				setRepos={setRepos}
				setLanguages={setLanguages}
				setTopContributingRepos={setTopContributingRepos}
				setUserName={setName}
				setSearchedUser={setSearchedUser}
			/>
			<div className='flex lg:flex-row flex-col lg:space-x-12 space-x-0 lg:space-y-0 space-y-8'>
				<ProfileOverView userData={userData} />
				<RepoOverview
					repos={repos}
					languages={languages}
					topContributingRepos={topContributingRepos}
					name={name}
					userName={searchedUser}
				/>
			</div>
		</main>
	);
}
