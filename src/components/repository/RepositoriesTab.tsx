import { Repo } from '@/types/repo';
import { ParallaxScrollGrid } from './ParallaxGrid';

interface RepositoriesTabProps {
	repos: Repo[] | null;
	onVisibleReposChange: (count: number) => void;
}

export function RepositoriesTab({
	repos,
	onVisibleReposChange,
}: RepositoriesTabProps) {
	return (
		<>
			<ParallaxScrollGrid
				repos={repos || []}
				onVisibleReposChange={onVisibleReposChange}
			/>
		</>
	);
}
