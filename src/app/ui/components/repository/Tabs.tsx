import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { BentoGridSecondDemo } from './BentoGrid';
import { ParallaxScrollGrid } from './ParallaxGrid';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { MostStarred } from '../charts/MostStarred';
import { TopLanguages } from '../charts/TopLanguages';
import { TotalContribution } from '../charts/TotalContrubution';
import { CommitActivity } from '../charts/CommitActivity';
import {
	getRepoStats,
	getUserStats,
	getAllRepos,
} from '@/app/actions/languageStats';
import { TopContributingRepos } from '../charts/TopContributingRepos';

const fetchRepoStats = async () => {
	try {
		const stats = await getRepoStats('devanup', 'devanup');
		console.log('Repo stats: ', stats);
	} catch (error) {
		console.error('Error fetching repo stats:', error);
	}
};

const fetchUserStats = async () => {
	try {
		const stats = await getUserStats('devanup');
		console.log('User stats: ', stats);
	} catch (error) {
		console.error('Error fetching user stats:', error);
	}
};

const fetchAllRepos = async () => {
	try {
		const stats = await getAllRepos('leerob');
		console.log('All Repos: ', stats);
	} catch (error) {
		console.error('Error fetching all repos:', error);
	}
};

export function RepoOverviewTab() {
	// fetchRepoStats();
	// fetchUserStats();
	fetchAllRepos();
	return (
		<Tabs
			defaultValue='stats'
			className='w-full h-[fit] border rounded-xl md:px-10 px-5 pb-5 mb-20 bg-gradient-to-b from-white/80 to-transparent '
		>
			<TabsList className='grid w-[350px] mx-auto grid-cols-2 my-10'>
				<TabsTrigger value='stats'>Statistics</TabsTrigger>
				<TabsTrigger value='repositories'>Repositories</TabsTrigger>
			</TabsList>
			<TabsContent value='stats'>
				<div className='flex flex-col space-y-6 items-center w-full my-10'>
					{/* <BentoGridSecondDemo /> */}
					<div className='flex w-full mx-auto space-x-6'>
						<Card className='w-[60%] flex flex-col justify-evenly rounded-xl'>
							<CardContent className='h-[300px] p-6 rounded-xl'>
								{/* <span>Most Starred</span> */}
								<TotalContribution />
							</CardContent>
							<CardFooter className='flex flex-col items-start px-6'>
								<h1 className='font-bold text-lg'>Total Contribution</h1>
								<p className='text-muted-foreground'>
									Anup has made over 1000 contributions in the last year
								</p>
							</CardFooter>
						</Card>

						<Card className='w-[40%] flex flex-col justify-evenly rounded-xl'>
							<CardContent className='h-[300px] p-6 rounded-xl'>
								{/* <span>Most Starred</span> */}
								<MostStarred />
							</CardContent>
							<CardFooter className='flex flex-col items-start px-6'>
								<h1 className='font-bold text-lg'>Most Starred</h1>
								<p className='text-muted-foreground'>
									Anup&apos;s repositories have garnered significant attention,
									with multiple projects receiving over 100 stars
								</p>
							</CardFooter>
						</Card>
					</div>

					<div className='flex justify-evenly w-full mx-auto space-x-6'>
						<Card className='w-[40%] flex flex-col rounded-xl'>
							<CardContent className='h-[300px] rounded-xl mt-6'>
								{/* <span>Most Starred</span> */}
								{/* <MostStarred /> */}
								<TopLanguages />
							</CardContent>
							<CardFooter className='flex flex-col items-start px-6'>
								<h1 className='font-bold text-lg'>Top Languages</h1>
								<p className='text-muted-foreground'>
									Anup is proficient in JavaScript, TypeScript, and Python
								</p>
							</CardFooter>
						</Card>

						<Card className='w-[60%] flex flex-col justify-evenly rounded-xl'>
							<CardContent className='h-[300px] p-6 rounded-xl'>
								{/* <span>Most Starred</span> */}
								{/* <TotalContribution /> */}
								{/* <CommitActivity /> */}
								<TopContributingRepos />
							</CardContent>
							<CardFooter className='flex flex-col items-start px-6'>
								<h1 className='font-bold text-lg'>
									Top Contributing Repositories
								</h1>
								<p className='text-muted-foreground'>
									Anup&apos;s top active repositories, highlighting dedicated
									contributions and consistent effort
									{/* Emphasizes which repositories are the most active, showcasing
									the user's contributions and effort in their projects. */}
									{/*<br /> Regular contributions demonstrate dedication and
									ongoing involvement in development tasks. */}
								</p>
							</CardFooter>
						</Card>
					</div>
				</div>
			</TabsContent>
			<TabsContent value='repositories'>
				<div className='flex w-full mb-10 '>
					<ParallaxScrollGrid />
				</div>
			</TabsContent>
		</Tabs>
	);
}
