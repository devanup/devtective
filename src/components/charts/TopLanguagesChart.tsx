'use client';
import { useState, useEffect, useMemo } from 'react';
import { TopLanguages } from './TopLanguages';
import { Card, CardContent } from '@/components/ui/card';
import { Language } from '@/types/repo';

interface TopLanguagesChartProps {
	languages: Language[];
	userName: string;
}

export function TopLanguagesChart({
	languages,
	userName,
}: TopLanguagesChartProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const formattedLanguages = useMemo(() => {
		return Array.isArray(languages)
			? languages.map((lang) => ({
					label: lang.label,
					value: lang.value,
					color: lang.color,
			  }))
			: [];
	}, [languages]);

	useEffect(() => {
		setIsLoading(true);
		setError(null);

		// Simulate a minimal delay to ensure state updates are processed
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 500);

		return () => clearTimeout(timer);
	}, [userName]); // Only re-run when userName changes

	if (isLoading) return <TopLanguagesSkeleton />;
	if (error) return <div className='text-red-500 text-center'>{error}</div>;
	if (formattedLanguages.length === 0) {
		return (
			<div className='text-center text-muted-foreground'>
				No language data available
			</div>
		);
	}

	return <TopLanguages data={formattedLanguages} />;
}

function TopLanguagesSkeleton() {
	return (
		<Card className='w-[100%] flex flex-col justify-evenly rounded-xl animate-pulse p-0'>
			<CardContent className='h-[250px] rounded-xl bg-gray-300 dark:bg-gray-700 animate-pulse' />
		</Card>
	);
}
