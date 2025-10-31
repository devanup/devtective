import { PinnedRepos } from './user/PinnedRepos';
import { UserCard } from './user/UserCard';
import { UserDetailsCard } from './user/UserDetailsCard';

import { UserData } from '@/types/user';
import { Repo } from '@/types/repo';

interface ProfileOverviewProps {
	userData: UserData | null;
	repos?: Repo[];
}

export default function ProfileOverView({ userData, repos = [] }: ProfileOverviewProps) {
	if (!userData) {
		return (
			<div className='w-3/6 text-muted-foreground flex justify-center text-lg'>
				No user data available
			</div>
		);
	}

	return (
		<main className='flex flex-col space-y-6'>
			<UserCard userData={userData} repos={repos} />
			<UserDetailsCard userData={userData} />
			<PinnedRepos userData={userData} />
		</main>
	);
}
