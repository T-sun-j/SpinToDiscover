"use client";

import { Button } from '../../components/ui/button';
import { HelpCircle, MessageCircle, BookOpen, Phone } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import Link from 'next/link';

export default function HelpPage() {
	const { t } = useLanguage();

	const helpItems = [
		{
			icon: <BookOpen className="h-5 w-5" />,
			title: t('help.faq'),
			description: t('help.faqDesc'),
			href: '/help/faq'
		},
		{
			icon: <MessageCircle className="h-5 w-5" />,
			title: t('help.contact'),
			description: t('help.contactDesc'),
			href: '/help/contact'
		},
		{
			icon: <Phone className="h-5 w-5" />,
			title: t('help.support'),
			description: t('help.supportDesc'),
			href: '/help/support'
		}
	];

	return (
		<main className="container-page flex min-h-dvh flex-col">
			{/* 使用公共头部组件 */}
			<Header 
				
			/>

			{/* 帮助内容 */}
			<section className="flex-1 p-4">
				{/* 欢迎信息 */}
				<div className="mb-6 text-center">
					<HelpCircle className="h-16 w-16 mx-auto mb-4 text-primary opacity-50" />
					<h2 className="text-xl font-semibold text-white mb-2">{t('help.welcome')}</h2>
					<p className="text-muted-foreground">{t('help.welcomeDesc')}</p>
				</div>

				{/* 帮助选项 */}
				<div className="space-y-3 mb-6">
					{helpItems.map((item, index) => (
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

				{/* 快速帮助 */}
				<div className="rounded-lg bg-card/60 p-4">
					<h3 className="font-medium text-white mb-3">{t('help.quickHelp')}</h3>
					<div className="space-y-2 text-sm text-muted-foreground">
						<p>• {t('help.quickHelp1')}</p>
						<p>• {t('help.quickHelp2')}</p>
						<p>• {t('help.quickHelp3')}</p>
					</div>
				</div>
			</section>

			{/* 页脚 */}
			<footer className="mt-auto text-center text-xs text-muted-foreground py-4">
				{t('help.footer')}
			</footer>
		</main>
	);
}
