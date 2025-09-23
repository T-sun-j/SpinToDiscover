"use client";

import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import Link from 'next/link';

export function Footer() {
	const { t } = useLanguage();

	return (
		<footer className={`mt-auto text-[11px] text-muted-foreground py-2 px-2 w-full font-inter`}>
			<div className="flex justify-between items-center w-full">
				{/* Left side - Language options */}
				<div className="flex items-center gap-2 font-inter">
					<LanguageSwitcher />
				</div>
				
				{/* Right side - Links and copyright */}
				<div className="flex items-center gap-2">
					<Link 
						href="/about" 
						className="text-[#101729]/60 hover:text-[#101729] transition-colors font-inter"
					>
						{t('footer.links.about')}
					</Link>
					<Link 
						href="/privacy" 
						className="text-[#101729]/60 hover:text-[#101729] transition-colors font-inter"
					>
						{t('footer.links.privacy')}
					</Link>
					<span className="text-[#101729]/60 font-inter">{t('footer.copyright')}</span>
				</div>
			</div>
		</footer>
	);
}
