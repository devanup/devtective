'use client';
import 'chart.js/auto';

import { Bar } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';

const data = {
	labels: [
		'Project 1',
		'Project 2',
		'Project 3',
		'Project 4',
		'Project 5',
		'Project 6',
	],
	datasets: [
		{
			label: 'Number of Commits',
			data: [120, 750, 360, 500, 200, 115],
			backgroundColor: [
				'rgba(255, 99, 132, 0.6)',
				'rgba(54, 162, 235, 0.6)',
				'rgba(255, 206, 86, 0.6)',
				'rgba(75, 192, 192, 0.6)',
				'rgba(153, 102, 255, 0.6)',
				'rgba(255, 159, 64, 0.6)',
			],
			borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)',
			],
			borderWidth: 0,
		},
	],
};

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
		},
	},
};

export function TopContributingRepos() {
	return <Bar data={data} options={options} />;
}
