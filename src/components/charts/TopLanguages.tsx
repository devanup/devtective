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

// Utility function to convert hex color to rgba with opacity
const convertHexToRGBA = (hex: string, opacity: number): string => {
	const cleanHex = hex.replace('#', '');
	const r = parseInt(cleanHex.substring(0, 2), 16);
	const g = parseInt(cleanHex.substring(2, 4), 16);
	const b = parseInt(cleanHex.substring(4, 6), 16);
	return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export function TopLanguages({ data }: { data: LanguageData[] }) {
	const { theme, systemTheme } = useTheme();
	const [textColor, setTextColor] = useState('rgba(0, 0, 0, 0.8)');

	useEffect(() => {
		const currentTheme = theme === 'system' ? systemTheme : theme;
		setTextColor(
			currentTheme === 'dark'
				? 'rgba(255, 255, 255, 0.8)'
				: 'rgba(0, 0, 0, 0.8)',
		);
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
				},
			},
		},
	};

	// Create the data for the chart
	const langData = {
		labels: data.map((lang) => lang.label),
		datasets: [
			{
				data: data.map((lang) => lang.value),
				backgroundColor: data.map((lang) =>
					lang.label === 'Others'
						? convertHexToRGBA('#808080', 0.6) // Light gray for "Others"
						: convertHexToRGBA(lang.color, 0.6),
				),
				borderColor: data.map((lang) => lang.color),
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
