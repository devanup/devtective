'use client';
import 'chart.js/auto';

import { Bar } from 'react-chartjs-2';

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
			// label: '# of stars',
			label: 'stars',

			// make the label dynamic and show the number of stars
			data: [120, 750, 360, 500, 200, 115],
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
			borderWidth: 0,
		},
	],
};

export function MostStarred() {
	return (
		<Bar
			className='w-[100%] object-contain'
			height={200}
			data={data}
			// width={400}
			options={{
				maintainAspectRatio: false,
				// make the legend hidden
				plugins: {
					legend: {
						display: false,
					},
					tooltip: {
						callbacks: {
							label: function (context) {
								const value = context.raw;
								return `${value}`;
							},
						},
					},
				},
				scales: {
					y: {
						beginAtZero: true,
					},
				},
			}}
		/>
	);
}
