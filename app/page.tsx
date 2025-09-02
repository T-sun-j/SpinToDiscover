"use client";

import { Button } from '../components/ui/button';
import { MapPin, Users, Settings, HelpCircle } from 'lucide-react';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Header } from '../components/Header';
import Link from 'next/link';

export default function HomePage() {
	const [animationData, setAnimationData] = useState<any>(null);
	const { t } = useLanguage();

	useEffect(() => {
		(async () => {
			try {
				const res = await fetch('https://assets10.lottiefiles.com/packages/lf20_1pxqjqps.json');
				setAnimationData(await res.json());
			} catch (e) {}
		})();
	}, []);

	return (
		<main className="container-page flex min-h-dvh flex-col">
			{/* 使用公共头部组件 */}
			<Header transparent />

			{/* 动画区域 */}
			<section className="flex flex-1 items-center justify-center py-2">
				<div className="w-full max-w-[360px]">
					{animationData ? (
						<Lottie animationData={animationData} loop autoplay style={{ width: '100%', height: 'auto' }} />
					) : (
						<div className="aspect-square w-full rounded-full bg-card/60 shadow-inner" />
					)}
				</div>
			</section>

			{/* 标题与按钮 */}
			<section className="pb-6">
				<h1 className="mb-5 text-center text-2xl font-bold tracking-tight">Spin. Discover. Connect.</h1>
				<div className="space-y-3">
					<Button className="w-full btn-gradient text-white shadow-md" size="lg">
						{t('buttons.spinToDiscover')}
					</Button>
					<Link href="/register">
						<Button className="w-full" variant="outline" size="lg">
							{t('buttons.createAccount')}
						</Button>
					</Link>
				</div>
			</section>

			{/* 功能导航 */}
			<section className="pb-6">
				<h2 className="text-lg font-semibold text-white mb-3 text-center">{t('navigation.quickAccess')}</h2>
				<div className="grid grid-cols-2 gap-3">
					<Link href="/discover">
						<Button variant="outline" className="w-full h-16 flex-col gap-2" size="lg">
							<MapPin className="h-5 w-5" />
							<span className="text-sm">{t('navigation.discover')}</span>
						</Button>
					</Link>
					<Link href="/community">
						<Button variant="outline" className="w-full h-16 flex-col gap-2" size="lg">
							<Users className="h-5 w-5" />
							<span className="text-sm">{t('navigation.community')}</span>
						</Button>
					</Link>
					<Link href="/settings">
						<Button variant="outline" className="w-full h-16 flex-col gap-2" size="lg">
							<Settings className="h-5 w-5" />
							<span className="text-sm">{t('navigation.settings')}</span>
						</Button>
					</Link>
					<Link href="/help">
						<Button variant="outline" className="w-full h-16 flex-col gap-2" size="lg">
							<HelpCircle className="h-5 w-5" />
							<span className="text-sm">{t('navigation.help')}</span>
						</Button>
					</Link>
				</div>
			</section>

			{/* 页脚 */}
			<footer className="mb-3 mt-auto text-center text-xs text-muted-foreground">
				<LanguageSwitcher />
				<div className="mt-2">
					{t('footer.links.about')}  {t('footer.links.privacy')}  {t('footer.copyright')}
				</div>
			</footer>
		</main>
	);
}
