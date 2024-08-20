import { ProfileStatCard } from './ProfileStatCard';
import { UserAvatarCard } from './UserAvatarCard';

export function UserCard({ userData }: { userData: any }) {
	return (
		<>
			<UserAvatarCard userData={userData} />
			<ProfileStatCard userData={userData} />
		</>
	);
}
