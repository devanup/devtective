import { UserData } from '@/types/user';
import { Repo } from '@/types/repo';
import { ProfileStatCard } from './ProfileStatCard';
import { UserAvatarCard } from './UserAvatarCard';

export function UserCard({ userData, repos = [] }: { userData: UserData; repos?: Repo[] }) {
	return (
		<>
			<UserAvatarCard userData={userData} repos={repos} />
			<ProfileStatCard userData={userData} />
		</>
	);
}
