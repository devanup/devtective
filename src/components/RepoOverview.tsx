import { RepoOverviewTab } from './repository/Tabs';

import { Repo, Language, TopContributingRepo } from '@/types/repo';

interface RepoOverviewProps {
	repos: Repo[] | null;
	topContributingRepos: TopContributingRepo[] | null;
	languages: Language[] | null;
	name: string | null;
	userName: string;
}

export default function RepoOverview({
	repos,
	languages,
	topContributingRepos,
	name,
	userName,
}: RepoOverviewProps) {
	return (
		<main className='flex flex-col items-center space-y-6 w-full overflow-scroll '>
			<RepoOverviewTab
				repos={repos ?? []}
				languages={languages ?? []}
				topContributingRepos={topContributingRepos ?? []}
				name={name}
				userName={userName}
			/>
		</main>
	);
}
