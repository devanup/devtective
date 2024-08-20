import GhPolyglot from 'gh-polyglot';

export const getUserStats = async (username: string) => {
	return new Promise((resolve, reject) => {
		const me = new GhPolyglot(username);
		me.userStats((err: any, stats: any) => {
			if (err) {
				reject(err);
			} else {
				resolve(stats);
			}
		});
	});
};
