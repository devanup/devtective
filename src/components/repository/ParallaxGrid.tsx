'use client';

import { ParallaxScroll } from '@/components/ui/parallax-scroll';

import { Repo } from '@/types/repo';

interface ParallaxScrollGridProps {
	repos: Repo[] | null;
}

export function ParallaxScrollGrid({ repos }: ParallaxScrollGridProps) {
	return <ParallaxScroll repos={repos || []} />;
}
