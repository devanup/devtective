'use client';

import { ParallaxScroll } from '@/components/ui/parallax-scroll';

import { Repo } from '@/types/repo';

interface ParallaxScrollGridProps {
	repos: Repo[] | null;
	onVisibleReposChange: (count: number) => void;
}

export function ParallaxScrollGrid({
	repos,
	onVisibleReposChange,
}: ParallaxScrollGridProps) {
	return (
		<ParallaxScroll
			repos={repos || []}
			onVisibleReposChange={onVisibleReposChange}
		/>
	);
}
