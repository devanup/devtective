import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import './calendar-heatmap-custom.css'; // Import custom CSS

export function CommitActivity() {
	const heatmapData = [
		{ date: '2023-01-01', count: 1 },
		{ date: '2023-01-02', count: 4 },
		{ date: '2023-01-03', count: 2 },
		{ date: '2023-01-04', count: 3 },
		{ date: '2023-01-05', count: 1 },
		{ date: '2023-01-06', count: 4 },
		{ date: '2023-01-07', count: 3 },
		{ date: '2023-01-08', count: 2 },
		{ date: '2023-01-09', count: 5 },
		{ date: '2023-01-10', count: 1 },
		// ... Add data for each day until July 2023
		{ date: '2023-02-01', count: 3 },
		{ date: '2023-02-02', count: 2 },
		{ date: '2023-02-03', count: 4 },
		{ date: '2023-02-04', count: 1 },
		{ date: '2023-02-05', count: 3 },
		{ date: '2023-02-06', count: 5 },
		{ date: '2023-02-07', count: 2 },
		{ date: '2023-02-08', count: 3 },
		{ date: '2023-02-09', count: 4 },
		{ date: '2023-02-10', count: 1 },
		// March
		{ date: '2023-03-01', count: 3 },
		{ date: '2023-03-02', count: 2 },
		{ date: '2023-03-03', count: 4 },
		{ date: '2023-03-04', count: 1 },
		{ date: '2023-03-05', count: 3 },
		{ date: '2023-03-06', count: 5 },
		{ date: '2023-03-07', count: 2 },
		{ date: '2023-03-08', count: 3 },
		{ date: '2023-03-09', count: 4 },
		{ date: '2023-03-10', count: 1 },
		// April
		{ date: '2023-04-01', count: 3 },
		{ date: '2023-04-02', count: 2 },
		{ date: '2023-04-03', count: 4 },
		{ date: '2023-04-04', count: 1 },
		{ date: '2023-04-05', count: 3 },
		{ date: '2023-04-06', count: 5 },
		{ date: '2023-04-07', count: 2 },
		{ date: '2023-04-08', count: 3 },
		{ date: '2023-04-09', count: 4 },
		{ date: '2023-04-10', count: 1 },
		// May
		{ date: '2023-05-01', count: 3 },
		{ date: '2023-05-02', count: 2 },
		{ date: '2023-05-03', count: 4 },
		{ date: '2023-05-04', count: 1 },
		{ date: '2023-05-05', count: 3 },
		{ date: '2023-05-06', count: 5 },
		{ date: '2023-05-07', count: 2 },
		{ date: '2023-05-08', count: 3 },
		{ date: '2023-05-09', count: 4 },
		{ date: '2023-05-10', count: 1 },
		// June
		{ date: '2023-06-01', count: 3 },
		{ date: '2023-06-02', count: 2 },
		{ date: '2023-06-03', count: 4 },
		{ date: '2023-06-04', count: 1 },
		{ date: '2023-06-05', count: 3 },
		{ date: '2023-06-06', count: 5 },
		{ date: '2023-06-07', count: 2 },
		{ date: '2023-06-08', count: 3 },
		{ date: '2023-06-09', count: 4 },
		{ date: '2023-06-10', count: 1 },
		// July
		{ date: '2023-07-01', count: 3 },
		{ date: '2023-07-02', count: 2 },
		{ date: '2023-07-03', count: 4 },
		{ date: '2023-07-04', count: 1 },
		{ date: '2023-07-05', count: 3 },
		{ date: '2023-07-06', count: 5 },
		{ date: '2023-07-07', count: 2 },
		{ date: '2023-07-08', count: 3 },
		{ date: '2023-07-09', count: 4 },
		{ date: '2023-07-10', count: 1 },
	];

	return (
		<div className='commit-activity'>
			<CalendarHeatmap
				startDate={new Date('2023-01-01')}
				endDate={new Date('2023-12-31')}
				values={heatmapData}
				classForValue={(value: any) => {
					if (!value) {
						return 'color-empty';
					}
					return `color-scale-${value.count}`;
				}}
			/>
		</div>
	);
}
