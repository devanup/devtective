'use client';
import 'chart.js/auto';
import { Line } from 'react-chartjs-2';
// this will be for creating a nice line chart to represent the total commits in a year

const data = {
	labels: [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
	],
	datasets: [
		{
			label: 'Total Commits',
			data: [120, 750, 360, 500, 200, 115, 100, 200, 300, 400],
			fill: false,
			backgroundColor: 'rgba(54, 162, 235, .7)',
			// backgroundColor: 'rgba(75,192,192,0.4)',
			// borderColor: 'rgba(75,192,192,1)',
			borderColor: 'rgba(54, 162, 235, .5)',
		},
	],
};

export function TotalContribution() {
	return (
		<Line
			data={data}
			options={{
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: false,
					},
				},
			}}
		/>
	);
}

// const data = {

// };

// export function TotalContribution() {
// 	return (

// 	);
// }
