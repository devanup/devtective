import { UserCard } from './components/user/UserCard';
import { UserDetailsCard } from './components/user/UserDetailsCard';

export default function ProfileOverView({
	userData,
	contributionData,
}: {
	userData: any;
	contributionData: any;
}) {
	return (
		<main className='flex flex-col space-y-6'>
			<UserCard userData={userData} contributionData={contributionData} />
			<UserDetailsCard userData={userData} />
		</main>
	);
}
