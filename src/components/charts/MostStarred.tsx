'use client';

import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface MostStarredProps {
	data: ChartData<'bar', number[], string>;
	userName: string;
}

export function MostStarred({ data, userName }: MostStarredProps) {
	const { theme, systemTheme } = useTheme();
	const [gridColor, setGridColor] = useState('rgba(0, 0, 0, 0.1)');
	const [textColor, setTextColor] = useState('rgba(0, 0, 0, 0.8)');

	useEffect(() => {
		const currentTheme = theme === 'system' ? systemTheme : theme;
		if (currentTheme === 'dark') {
			setGridColor('rgba(255, 255, 255, 0.1)');
			setTextColor('rgba(255, 255, 255, 0.8)');
		} else {
			setGridColor('rgba(0, 0, 0, 0.1)');
			setTextColor('rgba(0, 0, 0, 0.8)');
		}
	}, [theme, systemTheme]);

	const options: ChartOptions<'bar'> = {
		maintainAspectRatio: false,
		indexAxis: 'x',
		plugins: {
			legend: {
				display: false,
			},
		},
		scales: {
			x: {
				beginAtZero: true,
				grid: {
					color: gridColor,
				},
				ticks: {
					color: textColor,
				},
			},
			y: {
				grid: {
					color: gridColor,
				},
				ticks: {
					color: textColor,
				},
			},
		},
		onClick: (event, elements) => {
			if (elements.length > 0) {
				const index = elements[0].index;
				const repoName = data.labels?.[index] as string;
				const url = `https://github.com/${userName}/${repoName}`;
				window.open(url, '_blank', 'noopener,noreferrer');
			}
		},
		onHover: (event, elements) => {
			if (event.native && event.native.target instanceof HTMLElement) {
				event.native.target.style.cursor =
					elements.length > 0 ? 'pointer' : 'default';
			}
		},
	};

	return (
		<Bar
			className='w-full object-contain'
			height={200}
			data={data}
			options={options}
		/>
	);
}
