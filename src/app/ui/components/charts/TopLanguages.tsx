'use client';
import 'chart.js/auto';

import { Line, Pie } from 'react-chartjs-2';

const data = {
	labels: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'PHP'],
	datasets: [
		{
			// label: '# of stars',
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

export function TopLanguages() {
	return (
		<Pie
			className='w-full object-cover '
			height={400} // Adjust this to make the pie chart bigger
			data={data}
			options={{
				maintainAspectRatio: false, // This makes the chart responsive
				plugins: {
					legend: {
						position: 'right',
						align: 'start',
						labels: {
							boxHeight: 10,
						},
					},
				},
			}}
		/>
	);
}
