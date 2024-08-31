import { Repo } from '@/types/repo';
import { ParallaxScroll } from '../ui/parallax-scroll';

interface RepositoriesTabProps {
	repos: Repo[] | null;
}

export function RepositoriesTab({ repos }: RepositoriesTabProps) {
	return (
		<>
			<ParallaxScroll repos={repos || []} />
		</>
	);
}
