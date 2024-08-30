import { Card } from '../ui/card';
import { SiGithub } from 'react-icons/si';
import { IoStar } from 'react-icons/io5';
import { BiGitRepoForked } from 'react-icons/bi';
import { Repo } from '@/types/repo';
import { abbreviateNumber } from 'js-abbreviation-number';

interface RepoProps {
	repos: Repo[];
}

export function RepoCard({ repos }: RepoProps) {
	return (
		<Card className='w-[300px] p-6 rounded-xl flex flex-col gap-3 relative overflow-hidden'>
			{/* Github icon background */}
			<div className='absolute top-1/2 transform -translate-y-1/2 -right-52 opacity-[4%]'>
				<SiGithub size={400} />
			</div>

			{/* Repo name, description, language */}
			<div className='flex flex-col gap-2'>
				<span className='text-gray-500 text-sm'>TypeScript</span>
				<h1 className='font-bold text-2xl'>{repos[3].name}</h1>
				<p className='text-sm text-gray-500 my-3 flex-grow'>
					{repos[3].description}
				</p>
			</div>

			{/* Language, Stars, Forks */}
			<div className='text-gray-500 flex items-center gap-2 mt-auto text-sm'>
				<div className='flex items-center gap-4'>
					{/* Stars */}
					<div className='flex gap-1'>
						<IoStar size={17} />
						<span>{abbreviateNumber(repos[3].stargazers_count)}</span>
					</div>

					{/* Forks */}
					<div className='flex gap-1'>
						<BiGitRepoForked size={18} />
						<span>{abbreviateNumber(repos[3].forks)}</span>
					</div>
				</div>

				{/* Repo size */}
				<div className='flex ml-auto'>{abbreviateNumber(repos[3].size)} KB</div>
			</div>
		</Card>
	);
}
