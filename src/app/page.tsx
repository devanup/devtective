'use client';

import { useState, useEffect } from 'react';
import ProfileOverView from './ui/ProfileOverview';
import RepoOverview from './ui/RepoOverview';
import { Header } from './ui/components/Header';
import { getUserData } from './actions/userData';

export default function Home() {
	const [userData, setUserData] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			const data = await getUserData('leerob');
			setUserData(data);
		};
		fetchData();
	}, []);

	return (
		<main className='px-8 pb-8 max-w-[1800px] mx-auto'>
			<Header setUserData={setUserData} />
			<div className='flex lg:flex-row flex-col lg:space-x-8 space-x-0 lg:space-y-0 space-y-8'>
				<ProfileOverView userData={userData} />
				<RepoOverview />
			</div>
		</main>
	);
}
