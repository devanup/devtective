import { useEffect, useState } from 'react';
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

	const filters = [
		{
			label: 'Last Updated',
			value: 'last_updated',
			field: 'updated_at',
			order: 'desc',
		},
		{
			label: 'Last Created',
			value: 'last_created',
			field: 'created_at',
			order: 'desc',
		},
		{
			label: 'Earliest Created',
			value: 'earliest_created',
			field: 'created_at',
			order: 'asc',
		},
		{
			label: 'Most Stars',
			value: 'most_stars',
			field: 'stargazers',
			order: 'desc',
		},
		// { label: 'Name A-Z', value: 'name' },
		// { label: 'Name Z-A', value: 'name_desc' },
	];
	// alter the repos based on the filter selected
	const [filteredRepos, setFilteredRepos] = useState(repos);
	useEffect(() => {
		setFilteredRepos(repos);
	}, [repos]);
	return (
		<>
			<Tabs
				defaultValue='overview'
				className='w-full h-fit border rounded-xl pb-0 from-theme-bg to-transparent bg-gradient-to-b'
			>
				<TabsList className='grid w-[250px] mx-auto grid-cols-2 mt-10 md:mb-0 mb-5 p-2 -z-10'>
					<TabsTrigger value='overview'>Overview</TabsTrigger>
					<TabsTrigger value='repositories'>Repositories</TabsTrigger>
				</TabsList>
				{/* Statistics tab */}
				<TabsContent value='overview' className=' px-5 md:px-10 '>
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
						<h1>Showing 10 repositories</h1> {/* Filter menu */}
						<div className='absolute right-4 md:right-10'>
							<Select>
								<SelectTrigger className='w-[180px]'>
									<SelectValue placeholder='Most Stars' />
								</SelectTrigger>
								<SelectContent>
									{filters.map((filter) => (
										<SelectItem
											key={filter.value}
											disabled
											value={filter.value}
										>
											{filter.label}
										</SelectItem>
									))}
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
