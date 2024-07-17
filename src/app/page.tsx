import ProfileOverView from './ui/ProfileOverview';
import RepoOverview from './ui/RepoOverview';
import { Header } from './ui/components/Header';

export default function Home() {
	return (
		<main className='px-8 pb-8 max-w-[1800px] mx-auto'>
			<Header />
			<div className='flex space-x-8'>
				<ProfileOverView />
				<RepoOverview />
			</div>
		</main>
	);
}
