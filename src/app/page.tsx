import ProfileOverView from './ui/ProfileOverview';
import RepoOverview from './ui/RepoOverview';
import { Header } from './ui/components/Header';

export default function Home() {
	return (
		<main className='px-8 pb-8 max-w-[1800px] mx-auto'>
			<Header />
			<div className='flex lg:flex-row flex-col lg:space-x-8 lg:space-y-0 space-y-8'>
				<ProfileOverView />
				<RepoOverview />
			</div>
		</main>
	);
}
