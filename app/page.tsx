"use client";

import { Button } from '../components/ui/button';
import { MapPin, Users, Settings, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Header } from '../components/Header';
import Link from 'next/link';

export default function HomePage() {
	const { t } = useLanguage();

	return (
		<main className="container-page flex min-h-dvh flex-col">
			{/* 动画区域（全屏背景） */}
			<section className="relative min-h-dvh isolate">
				<video
					src="/earth.mp4"
					autoPlay
					loop
					muted
					playsInline
					className="absolute inset-0 -z-10 h-full w-full object-cover"
				/>

				{/* 顶部导航悬浮在视频上 */}
				<div className="relative z-10">
					<Header transparent />
				</div>

				{/* 核心文案与按钮悬浮在视频上 */}
				<div className="relative z-10 flex h-[calc(100dvh-64px)] items-center justify-center px-4">
					<div className="w-full max-w-md space-y-3 text-center">
						<h1 className="text-2xl font-bold tracking-tight">Spin. Discover. Connect.</h1>
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
					</div>
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
