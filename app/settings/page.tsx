"use client";

import { Button } from '../../components/ui/button';
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, User } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import Link from 'next/link';

export default function SettingsPage() {
	const { t } = useLanguage();

	const settingItems = [
		{
			icon: <User className="h-5 w-5" />,
			title: t('settings.profile'),
			description: t('settings.profileDesc'),
			href: '/settings/profile'
		},
		{
			icon: <Bell className="h-5 w-5" />,
			title: t('settings.notifications'),
			description: t('settings.notificationsDesc'),
			href: '/settings/notifications'
		},
		{
			icon: <Shield className="h-5 w-5" />,
			title: t('settings.privacy'),
			description: t('settings.privacyDesc'),
			href: '/settings/privacy'
		},
		{
			icon: <Palette className="h-5 w-5" />,
			title: t('settings.appearance'),
			description: t('settings.appearanceDesc'),
			href: '/settings/appearance'
		},
		{
			icon: <Globe className="h-5 w-5" />,
			title: t('settings.language'),
			description: t('settings.languageDesc'),
			href: '/settings/language'
		}
	];

	return (
		<main className="container-page flex min-h-dvh flex-col">
			{/* 使用公共头部组件 */}
			<Header 
				showBackButton 
				backUrl="/"
				title={t('navigation.settings')}
				rightAction={
					<Button variant="ghost" size="icon" aria-label="settings">
						<SettingsIcon className="h-5 w-5" />
					</Button>
				}
			/>

			{/* 设置列表 */}
			<section className="flex-1 p-4">
				<div className="space-y-3">
					{settingItems.map((item, index) => (
						<Link key={index} href={item.href}>
							<div className="flex items-center gap-4 p-4 rounded-xl bg-card/60 hover:bg-card/80 transition-colors">
								<div className="text-primary">
									{item.icon}
								</div>
								<div className="flex-1">
									<h3 className="font-medium text-white">{item.title}</h3>
									<p className="text-sm text-muted-foreground">{item.description}</p>
								</div>
								<Button variant="ghost" size="sm">
									<svg className="h-4 w-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
									</svg>
								</Button>
							</div>
						</Link>
					))}
				</div>
			</section>

			{/* 页脚 */}
			<footer className="mt-auto text-center text-xs text-muted-foreground py-4">
				{t('settings.version')} 1.0.0
			</footer>
		</main>
	);
}
