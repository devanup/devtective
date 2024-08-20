import { JetBrains_Mono, Gabarito } from 'next/font/google';

import Link from 'next/link';

const jetBrainsMono = JetBrains_Mono({ weight: '400', subsets: ['latin'] });
const gabarito = Gabarito({ weight: ['400'], subsets: ['latin'] });
export default function Footer() {
	return (
		<footer
			className={`${gabarito.className} mt-8 text-center text-muted-foreground dark:text-gray-400`}
		>
			<Link
				href='https://github.com/devanup/devtective'
				target='_blank'
				className='text-blue-400 dark:text-blue-300 hover:underline'
			>
				Devtective
			</Link>{' '}
			by{' '}
			<Link
				href='https://github.com/devanup'
				target='_blank'
				className='text-blue-400 dark:text-blue-300 hover:underline'
			>
				Anup
			</Link>{' '}
			&copy; {new Date().getFullYear()}
		</footer>
	);
}
