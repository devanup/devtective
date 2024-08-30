'use client';
import 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { ChartOptions, ChartData } from 'chart.js';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface TopContributingReposProps {
	data: {
		repo: string;
		totalCommits: number;
	}[];
	userName: string;
}

const CHART_COLORS = {
	backgroundColor: [
		'rgba(255, 99, 132, 0.4)',
		'rgba(54, 162, 235, 0.4)',
		'rgba(255, 206, 86, 0.4)',
		'rgba(75, 192, 192, 0.4)',
		'rgba(153, 102, 255, 0.4)',
		'rgba(255, 159, 64, 0.4)',
	],
	borderColor: [
		'rgba(255, 99, 132, 1)',
		'rgba(54, 162, 235, 1)',
		'rgba(255, 206, 86, 1)',
		'rgba(75, 192, 192, 1)',
		'rgba(153, 102, 255, 1)',
		'rgba(255, 159, 64, 1)',
	],
};

export function TopContributingRepos({
	data,
	userName,
}: TopContributingReposProps) {
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
		indexAxis: 'y', // Makes the chart horizontal
		maintainAspectRatio: false,
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
		animation: {
			duration: 400,
		},
		onClick: (event, elements) => {
			if (elements.length > 0) {
				const index = elements[0].index;
				const repoName = data[index].repo;
				// Assuming all repos belong to 'leerob' GitHub account
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

	const chartData: ChartData<'bar'> = {
		labels: data.map((item) => item.repo),
		datasets: [
			{
				label: 'Number of Commits',
				data: data.map((item) => item.totalCommits),
				backgroundColor: CHART_COLORS.backgroundColor.slice(0, data.length),
				borderColor: CHART_COLORS.borderColor.slice(0, data.length),
				borderWidth: 1,
			},
		],
	};

	return <Bar data={chartData} options={options} />;
}
