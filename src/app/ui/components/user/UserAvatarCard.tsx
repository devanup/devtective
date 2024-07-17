import { JetBrains_Mono, Gabarito } from 'next/font/google';
import { LinkPreview } from '@/components/ui/link-preview';

const jetBrainsMono = JetBrains_Mono({ weight: '400', subsets: ['latin'] });
const gabarito = Gabarito({
	weight: ['400'],
	subsets: ['latin'],
});

export function UserAvatarCard() {
	return (
		<div className='flex items-center space-x-6'>
			<div
				className='w-[110px] h-[110px] md:w-[170px] md:h-[170px] bg-white bg-opacity-50 rounded-xl'
				style={{
					backgroundImage: "url('/images/lr.png')",
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			/>
			<div className=' flex flex-col space-y-2'>
				<h1 className={`text-3xl font-bold ${gabarito.className} line-clamp-1`}>
					Lee Robinson
				</h1>
				<LinkPreview
					url='https://github.com/leerob'
					className={`text-xl text-muted-foreground w-fit ${jetBrainsMono.className} hover:text-gray-600 transition-colors duration-300 ease-in-out`}
				>
					@leerob
				</LinkPreview>
			</div>
		</div>
	);
}
