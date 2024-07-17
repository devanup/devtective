import Link from 'next/link';
import { DM_Mono, JetBrains_Mono } from 'next/font/google';

const dmMono = DM_Mono({ weight: '400', subsets: ['latin'] });
const jetBrainsMono = JetBrains_Mono({ weight: '400', subsets: ['latin'] });

export function UserAvatarCard() {
	return (
		<div className='flex items-center space-x-6'>
			<div
				className='w-[170px] h-[170px] bg-white bg-opacity-50 rounded-xl'
				style={{
					backgroundImage: "url('/images/devanup-avatar.png')",
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			/>
			<div className=' flex flex-col space-y-2'>
				<h1 className={`text-2xl font-bold`}>Anup Thapa</h1>
				<Link
					href=''
					className={`text-xl text-muted-foreground w-fit ${jetBrainsMono.className}`}
				>
					@devanup
				</Link>
			</div>
		</div>
	);
}
