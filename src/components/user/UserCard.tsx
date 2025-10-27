import { UserData } from '@/types/user';
import { ProfileStatCard } from './ProfileStatCard';
import { UserAvatarCard } from './UserAvatarCard';

export function UserCard({ userData }: { userData: UserData }) {
	return (
		<>
			<UserAvatarCard userData={userData} />
			<ProfileStatCard userData={userData} />
		</>
	);
}
