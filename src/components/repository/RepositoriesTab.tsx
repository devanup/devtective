import { Repo } from '@/types/repo';
import { ParallaxScroll } from '../ui/parallax-scroll';

interface RepositoriesTabProps {
	repos: Repo[] | null;
	visibleCount: number;
	setVisibleCount: (count: number) => void;
}

export function RepositoriesTab({
	repos,
	visibleCount,
	setVisibleCount,
}: RepositoriesTabProps) {
	return (
		<>
			<ParallaxScroll
				repos={repos || []}
				visibleCount={visibleCount}
				setVisibleCount={setVisibleCount}
			/>
		</>
	);
}
