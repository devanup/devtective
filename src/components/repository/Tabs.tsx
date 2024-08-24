import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatisticsTab } from './StatisticsTab';
import { RepositoriesTab } from './RepositoriesTab';
import { Language, Repo, TopContributingRepo } from '@/types/repo';
import Footer from '../Footer';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

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
				<TabsList className='grid w-[250px] mx-auto grid-cols-2 mt-10 md:mb-0 mb-5 p-2 -z-10'>
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
				</TabsContent>
				{/* Repositories tab */}
				<TabsContent value='repositories'>
					{/* Number of repos */}
					<div className='relative text-muted-foreground flex items-center justify-start ml-4 md:ml-0 md:justify-center text-sm -mt-3 mb-0 bg-transparent pt-8 pb-6'>
						<h1>Showing 10 repositories</h1>{' '}
						{/* {repos.length === 0
							? 'No repos found'
							: visibleRepos === repos.length
							? `Showing all ${repos.length} ${
									repos.length === 1 ? 'repo' : 'repos'
							  }`
							: `Showing ${visibleRepos} of ${repos.length} ${
									repos.length === 1 ? 'repo' : 'repos'
							  }`} */}
						<div className='absolute right-4 md:right-10'>
							<Select>
								<SelectTrigger className='w-[180px]'>
									<SelectValue placeholder='Last Pushed' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='pushed_at'>Last Pushed</SelectItem>
									<SelectItem value='stars'>Stars</SelectItem>
									<SelectItem value='size'>Size</SelectItem>
									<SelectItem value='forks'>Forks</SelectItem>
								</SelectContent>
							</Select>
						</div>
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
