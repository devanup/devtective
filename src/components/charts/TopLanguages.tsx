'use client';
import 'chart.js/auto';
import { Pie } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface LanguageData {
	label: string;
	value: number;
	color: string;
}

export function TopLanguages({ data }: { data: LanguageData[] }) {
	const { theme, systemTheme } = useTheme();
	const [textColor, setTextColor] = useState('rgba(0, 0, 0, 0.8)');

	useEffect(() => {
		const currentTheme = theme === 'system' ? systemTheme : theme;
		setTextColor(currentTheme === 'dark' ? 'white' : 'rgba(0, 0, 0, 0.8)');
	}, [theme, systemTheme]);

	const chartOptions: ChartOptions<'pie'> = {
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'right',
				align: 'start',
				labels: {
					boxHeight: 10,
					color: textColor,
					generateLabels: (chart) => {
						const datasets = chart.data.datasets;
						return (
							chart.data.labels?.map((label, i) => {
								const value = datasets[0].data[i];
								const bgColors = datasets[0].backgroundColor;
								const borderColors = datasets[0].borderColor;

								// Safely extract colors from arrays
								const fillStyle = Array.isArray(bgColors)
									? (bgColors[i] as string)
									: (bgColors as string);
								const strokeStyle = Array.isArray(borderColors)
									? (borderColors[i] as string)
									: (borderColors as string);

								return {
									text: `${label}: ${value}%`,
									fillStyle,
									strokeStyle,
									lineWidth: datasets[0].borderWidth as number,
									hidden: false,
									index: i,
									fontColor: textColor,
								};
							}) || []
						);
					},
				},
			},
			tooltip: {
				callbacks: {
					label: (context) => {
						const label = context.label || '';
						const value = context.parsed;
						return `${label}: ${value}%`;
					},
				},
			},
		},
		animation: {
			duration: 400,
		},
	};

	// Create the data for the chart
	const langData = {
		labels: data.map((lang) => lang.label),
		datasets: [
			{
				data: data.map((lang) => lang.value),
				// Colors are already provided as RGBA from the formatter
				backgroundColor: data.map((lang) =>
					lang.label === 'Others' ? 'rgba(128, 128, 128, 0.6)' : lang.color,
				),
				borderColor: data.map((lang) =>
					lang.label === 'Others' ? 'rgba(128, 128, 128, 0.9)' : lang.color,
				),
				borderWidth: 0.5,
			},
		],
	};

	return (
		<Pie
			className='w-full object-cover'
			height={400}
			data={langData}
			options={chartOptions}
		/>
	);
}
