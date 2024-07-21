import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BentoGridSecondDemo } from './BentoGrid';
import { ParallaxScrollGrid } from './ParallaxGrid';

export function RepoOverviewTab() {
	return (
		<Tabs
			defaultValue='stats'
			className='w-full border drop-shadow-sm rounded-xl bg-gradient-to-b from-white/60 to-transparent  '
		>
			<TabsList className='grid w-[350px] mx-auto grid-cols-2 my-10'>
				<TabsTrigger value='stats'>Statistics</TabsTrigger>
				<TabsTrigger value='repositories'>Repositories</TabsTrigger>
			</TabsList>
			<TabsContent value='stats'>
				<div className='flex items-center w-full my-10'>
					<BentoGridSecondDemo />
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
