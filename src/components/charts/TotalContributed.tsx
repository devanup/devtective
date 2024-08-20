'use client';
import 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { ChartData, ChartOptions } from 'chart.js';

interface ContributionDay {
	weekday: number;
	date: string;
	contributionCount: number;
	color: string;
}

interface ContributionWeek {
	contributionDays: ContributionDay[];
}

interface ContributionMonth {
	name: string;
	year: number;
	firstDay: string;
	totalWeeks: number;
}

interface ContributionData {
	totalContributions: number;
	weeks: ContributionWeek[];
	months: ContributionMonth[];
}

interface TotalContributedProps {
	data: ContributionData;
}

export function TotalContributed({ data }: TotalContributedProps) {
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

	const monthlyContributions = data.months.map((month) => {
		const startDate = new Date(month.firstDay);
		const endDate = new Date(startDate);
		endDate.setDate(endDate.getDate() + month.totalWeeks * 7 - 1);

		const contributions = data.weeks
			.flatMap((week) => week.contributionDays)
			.filter((day) => {
				const date = new Date(day.date);
				return date >= startDate && date <= endDate;
			})
			.reduce((sum, day) => sum + day.contributionCount, 0);

		return {
			month: `${month.year}-${month.name}`,
			contributions: contributions,
		};
	});

	const chartData: ChartData<'line'> = {
		labels: monthlyContributions.map((item) => {
			const [year, month] = item.month.split('-');
			return `${month} ${year}`;
		}),
		datasets: [
			{
				label: 'Total Contributions',
				data: monthlyContributions.map((item) => item.contributions),
				fill: true,
				backgroundColor: 'rgba(54, 162, 235, .4)',
				borderColor: 'rgba(54, 162, 235, .5)',
				borderWidth: 1,
			},
		],
	};

	const options: ChartOptions<'line'> = {
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				mode: 'index',
				intersect: false,
			},
		},
		scales: {
			x: {
				grid: {
					color: gridColor,
				},
				ticks: {
					color: textColor,
				},
			},
			y: {
				beginAtZero: true,
				grid: {
					color: gridColor,
				},
				ticks: {
					color: textColor,
				},
			},
		},
		hover: {
			mode: 'index',
			intersect: false,
		},
	};

	return <Line data={chartData} options={options} />;
}
