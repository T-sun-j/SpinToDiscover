"use client";

import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';



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
					<span className="whitespace-nowrap font-inter">{t('footer.links.about')} {t('footer.links.privacy')} {t('footer.copyright')}</span>
				</div>
			</div>
		</footer>
	);
}
