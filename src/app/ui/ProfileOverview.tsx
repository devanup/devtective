import { UserCard } from './components/user/UserCard';
import { UserDetailsCard } from './components/user/UserDetailsCard';

export default function ProfileOverView({ userData }: { userData: any }) {
	return (
		<main className='flex flex-col space-y-6'>
			<UserCard userData={userData} />
			<UserDetailsCard userData={userData} />
		</main>
	);
}
