import { Repo } from '@/types/repo';
import { ParallaxScrollGrid } from './ParallaxGrid';

interface RepositoriesTabProps {
	repos: Repo[] | null;
}

export function RepositoriesTab({ repos }: RepositoriesTabProps) {
	return (
		<>
			<ParallaxScrollGrid repos={repos || []} />
		</>
	);
}
