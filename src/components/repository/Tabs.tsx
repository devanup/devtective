import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatisticsTab } from './StatisticsTab';
import { RepositoriesTab } from './RepositoriesTab';
import { Language, Repo, TopContributingRepo } from '@/types/repo';
import Footer from '../Footer';

interface RepoOverviewTabProps {
	repos: Repo[];
	languages: Language[];
	topContributingRepos: TopContributingRepo[];
	name: string | null;
	userName: string;
}

export function RepoOverviewTab({
	repos,
	languages,
	topContributingRepos,
	name,
	userName,
}: RepoOverviewTabProps) {
	const [visibleRepos, setVisibleRepos] = useState(6);

	return (
		<>
			<Tabs
				defaultValue='stats'
				className='w-full h-fit border rounded-xl pb-0 from-theme-bg to-transparent bg-gradient-to-b'
			>
				<TabsList className='grid w-[250px] mx-auto grid-cols-2 mt-10 p-2'>
					<TabsTrigger value='stats'>Statistics</TabsTrigger>
					<TabsTrigger value='repositories'>Repositories</TabsTrigger>
				</TabsList>
				{/* Statistics tab */}
				<TabsContent value='stats' className=' px-5 md:px-10 '>
					<StatisticsTab
						repos={repos}
						languages={languages}
						topContributingRepos={topContributingRepos}
						name={name}
						userName={userName}
					/>
					{/* disclaimer message */}
					{/* <div className='text-muted-foreground/80 flex justify-center text-sm -mt-3 mb-0 bg-transparent pt-0 pb-6'>
					Note: Data represents recent years and may have slight variations due
					to GitHub API limitations
				</div> */}
				</TabsContent>
				{/* Repositories tab */}
				<TabsContent value='repositories'>
					{/* Number of repos */}
					<div className='text-muted-foreground flex justify-center text-sm -mt-3 mb-0 bg-transparent pt-8 pb-6'>
						{repos.length === 0
							? 'No repos found'
							: visibleRepos === repos.length
							? `Showing all ${repos.length} ${
									repos.length === 1 ? 'repo' : 'repos'
							  }`
							: `Showing ${visibleRepos} of ${repos.length} ${
									repos.length === 1 ? 'repo' : 'repos'
							  }`}
					</div>
					<RepositoriesTab
						repos={repos}
						onVisibleReposChange={setVisibleRepos}
					/>
				</TabsContent>
			</Tabs>
			<Footer />
		</>
	);
}
