// actions.js (or your helper functions file)
// import { z } from 'zod';

// const githubUserSchema = z.object({
// 	login: z.string(),
// 	avatar_url: z.string().url(),
// 	html_url: z.string().url(),
// 	repos_url: z.string().url(),
// 	name: z.string().nullable(),
// 	company: z.string().nullable(),
// 	blog: z.string().url().nullable(),
// 	location: z.string().nullable(),
// 	email: z.string().email().nullable(),
// 	public_repos: z.number().int(),
// 	followers: z.number().int(),
// 	following: z.number().int(),
// 	created_at: z.string().refine((val) => !isNaN(Date.parse(val)), {
// 		message: 'Invalid date format',
// 	}),
// });

export async function fetchUserData(username: string) {
	if (!username) throw new Error('Username is required');

	const res = await fetch(`https://api.github.com/users/${username}`);
	if (!res.ok) throw new Error('Failed to fetch user data');

	const data = await res.json();
	return data;
	// try {
	// 	const validatedData = githubUserSchema.parse(data);
	// 	return validatedData;
	// } catch (e) {
	// 	console.error('Validation error:', e.errors);
	// 	throw e;
	// }
}
