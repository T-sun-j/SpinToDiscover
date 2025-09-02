"use client";

import { Button } from '../../components/ui/button';
import { UserPlus } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';

export default function CommunityPage() {
	const { t } = useLanguage();

	return (
		<main className="container-page flex min-h-dvh flex-col">
			{/* 使用公共头部组件 */}
			<Header 
				showBackButton 
				backUrl="/"
				title={t('navigation.community')}
				rightAction={
					<Button variant="ghost" size="icon" aria-label="add friend">
						<UserPlus className="h-5 w-5" />
					</Button>
				}
			/>

			{/* 内容区域 */}
			<section className="flex-1 p-4">
				<div className="mb-6 rounded-lg bg-card p-4 shadow-md">
					<h2 className="mb-3 text-lg font-semibold text-white">{t('community.onlineUsers')}</h2>
					<div className="flex flex-wrap gap-3">
						{/* 示例用户头像 */}
						<div className="flex flex-col items-center">
							<div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white text-sm">A</div>
							<span className="mt-1 text-xs text-muted-foreground">User1</span>
						</div>
						<div className="flex flex-col items-center">
							<div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-white text-sm">B</div>
							<span className="mt-1 text-xs text-muted-foreground">User2</span>
						</div>
						<div className="flex flex-col items-center">
							<div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white text-sm">C</div>
							<span className="mt-1 text-xs text-muted-foreground">User3</span>
						</div>
					</div>
				</div>

				<div className="rounded-lg bg-card p-4 shadow-md">
					<h2 className="mb-3 text-lg font-semibold text-white">{t('community.recentPosts')}</h2>
					<div className="space-y-4">
						{/* 示例帖子 */}
						<div className="flex items-start gap-3">
							<div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-white text-xs">U</div>
							<div>
								<p className="text-sm font-medium text-white">User4</p>
								<p className="text-xs text-muted-foreground">{t('community.postContent')}</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">U</div>
							<div>
								<p className="text-sm font-medium text-white">User5</p>
								<p className="text-xs text-muted-foreground">{t('community.postContent')}</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
