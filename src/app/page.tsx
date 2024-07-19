'use client';

import { useState, useEffect } from 'react';
import ProfileOverView from './ui/ProfileOverview';
import RepoOverview from './ui/RepoOverview';
import { Header } from './ui/components/Header';
import { getUserData } from './actions/userData';
import { getContributionData } from './actions/contributionData'; // Import the missing function from the correct file

export default function Home() {
	const [userData, setUserData] = useState(null);
	const [contributionData, setContributionData] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [user, contributions] = await Promise.all([
					getUserData('leerob'),
					getContributionData('leerob'),
				]);
				setUserData(user);
				setContributionData(contributions);
				console.log('Contribution data: ', contributions);
			} catch (error) {
				console.log('Error fetching data:', error);
			}
		};
		fetchData();
	}, []);

	return (
		<main className='px-8 pb-8 max-w-[1800px] mx-auto'>
			<Header
				setUserData={setUserData}
				setContributionData={setContributionData}
			/>
			<div className='flex lg:flex-row flex-col lg:space-x-8 space-x-0 lg:space-y-0 space-y-8'>
				<ProfileOverView
					userData={userData}
					contributionData={contributionData}
				/>
				<RepoOverview />
			</div>
		</main>
	);
}
