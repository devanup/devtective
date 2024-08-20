/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: [
			'api.microlink.io', // Microlink Image Preview
			'avatars.githubusercontent.com', // GitHub Avatar
		],
		// remotePatterns: [{ hostname: 'avatars.githubusercontent.com' }],
	},
	// experimental: {
	// 	appDir: true,
	// 	serverActions: true,
	// },
};

export default nextConfig;
