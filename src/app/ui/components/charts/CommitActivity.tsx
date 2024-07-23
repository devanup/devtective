import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import './calendar-heatmap-custom.css';

export function CommitActivity() {
	// Calculate the current date and one year prior
	const currentDate = new Date();
	const oneYearAgo = new Date();
	oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

	const heatmapData = [
		{ date: '2023-07-01', count: 1 },
		{ date: '2023-07-02', count: 4 },
		{ date: '2023-07-03', count: 2 },
		{ date: '2023-07-04', count: 3 },
		{ date: '2023-07-05', count: 1 },
		{ date: '2023-07-06', count: 4 },
		{ date: '2023-07-07', count: 3 },
		{ date: '2023-07-08', count: 2 },
		{ date: '2023-07-09', count: 5 },
		{ date: '2023-07-10', count: 1 },

		{ date: '2023-08-01', count: 3 },
		{ date: '2023-08-02', count: 2 },
		{ date: '2023-08-03', count: 4 },
		{ date: '2023-08-04', count: 1 },
		{ date: '2023-08-05', count: 3 },
		{ date: '2023-08-06', count: 5 },
		{ date: '2023-08-07', count: 2 },
		{ date: '2023-08-08', count: 3 },
		{ date: '2023-08-09', count: 4 },
		{ date: '2023-08-10', count: 1 },

		{ date: '2023-09-01', count: 3 },
		{ date: '2023-09-02', count: 2 },
		{ date: '2023-09-03', count: 4 },
		{ date: '2023-09-04', count: 1 },
		{ date: '2023-09-05', count: 3 },
		{ date: '2023-09-06', count: 5 },
		{ date: '2023-09-07', count: 2 },
		{ date: '2023-09-08', count: 3 },
		{ date: '2023-09-09', count: 4 },
		{ date: '2023-09-10', count: 1 },

		{ date: '2023-10-01', count: 3 },
		{ date: '2023-10-02', count: 2 },
		{ date: '2023-10-03', count: 4 },
		{ date: '2023-10-04', count: 1 },
		{ date: '2023-10-05', count: 3 },
		{ date: '2023-10-06', count: 5 },
		{ date: '2023-10-07', count: 2 },
		{ date: '2023-10-08', count: 3 },
		{ date: '2023-10-09', count: 4 },
		{ date: '2023-10-10', count: 1 },

		{ date: '2023-11-01', count: 3 },
		{ date: '2023-11-02', count: 2 },
		{ date: '2023-11-03', count: 4 },
		{ date: '2023-11-04', count: 1 },
		{ date: '2023-11-05', count: 3 },
		{ date: '2023-11-06', count: 5 },
		{ date: '2023-11-07', count: 2 },
		{ date: '2023-11-08', count: 3 },
		{ date: '2023-11-09', count: 4 },
		{ date: '2023-11-10', count: 1 },

		{ date: '2023-12-01', count: 3 },
		{ date: '2023-12-02', count: 2 },
		{ date: '2023-12-03', count: 4 },
		{ date: '2023-12-04', count: 1 },
		{ date: '2023-12-05', count: 3 },
		{ date: '2023-12-06', count: 5 },
		{ date: '2023-12-07', count: 2 },
		{ date: '2023-12-08', count: 3 },
		{ date: '2023-12-09', count: 4 },
		{ date: '2023-12-10', count: 1 },

		{ date: '2024-01-01', count: 3 },
		{ date: '2024-01-02', count: 2 },
		{ date: '2024-01-03', count: 4 },
		{ date: '2024-01-04', count: 1 },
		{ date: '2024-01-05', count: 3 },
		{ date: '2024-01-06', count: 5 },
		{ date: '2024-01-07', count: 2 },
		{ date: '2024-01-08', count: 3 },
		{ date: '2024-01-09', count: 4 },
		{ date: '2024-01-10', count: 1 },

		{ date: '2024-02-01', count: 3 },
		{ date: '2024-02-02', count: 2 },
		{ date: '2024-02-03', count: 4 },
		{ date: '2024-02-04', count: 1 },
		{ date: '2024-02-05', count: 3 },
		{ date: '2024-02-06', count: 5 },
		{ date: '2024-02-07', count: 2 },
		{ date: '2024-02-08', count: 3 },
		{ date: '2024-02-09', count: 4 },
		{ date: '2024-02-10', count: 1 },

		{ date: '2024-03-01', count: 3 },
		{ date: '2024-03-02', count: 2 },
		{ date: '2024-03-03', count: 4 },
		{ date: '2024-03-04', count: 1 },
		{ date: '2024-03-05', count: 3 },
		{ date: '2024-03-06', count: 5 },
		{ date: '2024-03-07', count: 2 },
		{ date: '2024-03-08', count: 3 },
		{ date: '2024-03-09', count: 4 },
		{ date: '2024-03-10', count: 1 },

		{ date: '2024-04-01', count: 3 },
		{ date: '2024-04-02', count: 2 },
		{ date: '2024-04-03', count: 4 },
		{ date: '2024-04-04', count: 1 },
		{ date: '2024-04-05', count: 3 },
		{ date: '2024-04-06', count: 5 },
		{ date: '2024-04-07', count: 2 },
		{ date: '2024-04-08', count: 3 },
		{ date: '2024-04-09', count: 3 },
		{ date: '2024-04-10', count: 3 },

		{ date: '2024-07-01', count: 4 },
		{ date: '2024-07-02', count: 5 },
		{ date: '2024-07-03', count: 1 },
		{ date: '2024-07-04', count: 7 },
		{ date: '2024-07-05', count: 8 },
		{ date: '2024-07-06', count: 5 },
		{ date: '2024-07-07', count: 9 },
		{ date: '2024-07-08', count: 3 },
		{ date: '2024-07-09', count: 5 },
		{ date: '2024-07-10', count: 1 },
	];

	return (
		<div className='commit-activity'>
			<CalendarHeatmap
				startDate={oneYearAgo}
				endDate={currentDate}
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
