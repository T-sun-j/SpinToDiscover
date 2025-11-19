"use client";

import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import Link from 'next/link';
import Image from 'next/image';

interface FooterProps {
	transparent?: boolean;
}

export function Footer({ transparent = false }: FooterProps) {
	const { t } = useLanguage();

	return (
		<footer className={`mt-auto text-[10px] py-4 px-4 w-full font-inter ${transparent ? 'text-white' : 'text-[#0F1728]'}`}>
			<div className="flex justify-between items-center w-full">
				{/* Left side - Language options */}
				<div className="flex items-center gap-2 font-inter">
					<LanguageToggle transparent={transparent} />
				</div>

				{/* Right side - Links and copyright */}
				<div className="flex items-center gap-2 whitespace-nowrap">
					<Link
						href="/about"
						className="text-[#0F1728] font-inter"
					>
						{t('footer.links.about')}
					</Link>
					<Link
						href="/privacy"
						className="text-[#0F1728] font-inter"
					>
						{t('footer.links.privacy')}
					</Link>
					<span className="text-[#0F1728] font-inter">{t('footer.copyright')}</span>
					<Image
						src="/img/logo-2.png"
						alt="Language"
						width={20}
						height={20}
						className="h-5 w-auto"
					/>
				</div>
			</div>
		</footer>
	);
}
