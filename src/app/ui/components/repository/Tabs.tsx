import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { BentoGridSecondDemo } from './BentoGrid';
import { ParallaxScrollGrid } from './ParallaxGrid';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { MostStarred } from '../charts/MostStarred';
import { TopLanguages } from '../charts/TopLanguages';
import { TotalContribution } from '../charts/TotalContrubution';
import { CommitActivity } from '../charts/CommitActivity';

export function RepoOverviewTab() {
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
									Anup has 10+ repositories with 100+ stars
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
									Anup is proficient in JavaScript, TypeScript, and Python.
								</p>
							</CardFooter>
						</Card>

						<Card className='w-[60%] flex flex-col justify-evenly rounded-xl'>
							<CardContent className='h-[300px] p-6 rounded-xl'>
								{/* <span>Most Starred</span> */}
								{/* <TotalContribution /> */}
								<CommitActivity />
							</CardContent>
							<CardFooter className='flex flex-col items-start px-6'>
								<h1 className='font-bold text-lg'>Commit Activity</h1>
								<p className='text-muted-foreground'>
									Coding activity provides insight into engagement with projects
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
