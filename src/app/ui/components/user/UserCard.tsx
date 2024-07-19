import { ProfileStatCard } from './ProfileStatCard';
import { UserAvatarCard } from './UserAvatarCard';

export function UserCard({
	userData,
	contributionData,
}: {
	userData: any;
	contributionData: any;
}) {
	return (
		<>
			<UserAvatarCard userData={userData} />
			<ProfileStatCard
				userData={userData}
				contributionData={contributionData}
			/>
		</>
	);
}
