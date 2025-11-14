"use client";

import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import Link from 'next/link';

interface FooterProps {
	transparent?: boolean;
}

export function Footer({ transparent = false }: FooterProps) {
	const { t } = useLanguage();

	return (
		<footer className={`mt-auto text-[11px] py-2 px-2 w-full font-inter ${transparent ? 'text-white' : 'text-muted-foreground'}`}>
			<div className="flex justify-between items-center w-full">
				{/* Left side - Language options */}
				<div className="flex items-center gap-2 font-inter">
					<LanguageToggle transparent={transparent} />
				</div>
				
				{/* Right side - Links and copyright */}
				<div className="flex items-center gap-2 whitespace-nowrap">
					<Link 
						href="/about" 
						className="text-muted-foreground font-inter"
					>
						{t('footer.links.about')}
					</Link>
					<Link 
						href="/privacy" 
						className="text-muted-foreground font-inter"
					>
						{t('footer.links.privacy')}
					</Link>
					<span className="text-muted-foreground font-inter">{t('footer.copyright')}</span>
				</div>
			</div>
		</footer>
	);
}
