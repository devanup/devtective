/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: [
			'api.microlink.io', // Microlink Image Preview
		],
		// remotePatterns: [{ hostname: 'avatars.githubusercontent.com' }],
	},
};

export default nextConfig;
