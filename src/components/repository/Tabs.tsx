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
	const [filterValue, setFilterValue] = useState('last_pushed');
	const [filteredRepos, setFilteredRepos] = useState(repos);

	const filters = [
		{
			label: 'Last Pushed',
			value: 'last_pushed',
			field: 'pushedAt',
			order: 'desc',
		},
		{
			label: 'Most Stars',
			value: 'most_stars',
			field: 'stargazerCount',
			order: 'desc',
		},
		{
			label: 'Most Forks',
			value: 'most_forks',
			field: 'forkCount',
			order: 'desc',
		},
		{
			label: 'Largest Size',
			value: 'size',
			field: 'diskUsage',
			order: 'desc',
		},
	];

	useEffect(() => {
		if (Array.isArray(repos)) {
			const sortedRepos = [...repos]
				.filter((repo) => {
					switch (filterValue) {
						case 'last_pushed':
							return true; // All repos have a pushed date
						case 'most_stars':
							return repo.stargazerCount > 0;
						case 'most_forks':
							return repo.forkCount > 0;
						case 'size':
							return repo.diskUsage > 0;
						default:
							return true;
					}
				})
				.sort((a, b) => {
					switch (filterValue) {
						case 'last_pushed':
							return (
								new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime()
							);
						case 'most_stars':
							return b.stargazerCount - a.stargazerCount;
						case 'most_forks':
							return b.forkCount - a.forkCount;
						case 'size':
							return b.diskUsage - a.diskUsage;
						default:
							return 0;
					}
				});
			setFilteredRepos(sortedRepos);
		} else {
			setFilteredRepos([]);
		}
	}, [repos, filterValue]);

	const repoCount = filteredRepos.length;
	const displayCount = Math.min(repoCount, 10);

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
					<div className='relative text-muted-foreground flex md:flex-row flex-col items-center justify-start ml-4 md:ml-0 md:justify-center text-sm -mt-5 mb-0 bg-transparent pt-8 pb-6'>
						{repoCount > 0 ? (
							<h1>
								Showing {displayCount}{' '}
								{displayCount === 1 ? 'repository' : 'repositories'}
							</h1>
						) : (
							<div className='flex items-center justify-center my-10'>
								<h1>No repositories match the selected filter</h1>
							</div>
						)}
						<div className='md:absolute right-4 md:right-10 mt-5 md:mt-0'>
							<Select onValueChange={(value) => setFilterValue(value)}>
								<SelectTrigger className='w-[180px]'>
									<SelectValue placeholder='Last Pushed' />
								</SelectTrigger>
								<SelectContent>
									{filters.map((filter) => (
										<SelectItem key={filter.value} value={filter.value}>
											{filter.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{repoCount > 0 && <RepositoriesTab repos={filteredRepos} />}
				</TabsContent>
			</Tabs>
			<Footer />
		</>
	);
}
