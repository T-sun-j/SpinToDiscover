"use client";

import { Button } from '../../components/ui/button';
import { MapPin, Filter, Star } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';

export default function DiscoverPage() {
	const { t } = useLanguage();

	return (
		<main className="container-page flex min-h-dvh flex-col">
			{/* 使用公共头部组件，启用搜索功能 */}
			<Header 
				showBackButton 
				backUrl="/"
				title={t('navigation.discover')}
				showSearch
				rightAction={
					<Button variant="ghost" size="icon" aria-label="filter">
						<Filter className="h-5 w-5" />
					</Button>
				}
			/>

			{/* 地图区域 */}
			<section className="flex-1 mb-4">
				<div className="w-full h-64 rounded-2xl bg-card/60 flex items-center justify-center">
					<div className="text-center text-muted-foreground">
						<MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
						<p>{t('discover.mapPlaceholder')}</p>
					</div>
				</div>
			</section>

			{/* 热门地点 */}
			<section className="mb-6">
				<h2 className="text-lg font-semibold text-white mb-3">{t('discover.popularPlaces')}</h2>
				<div className="space-y-3">
					{['Istanbul', 'Tokyo', 'New York', 'Paris'].map((city) => (
						<div key={city} className="flex items-center justify-between p-3 rounded-xl bg-card/60">
							<div className="flex items-center gap-3">
								<MapPin className="h-5 w-5 text-primary" />
								<span className="text-white">{city}</span>
							</div>
							<Button variant="ghost" size="sm">
								<Star className="h-4 w-4" />
							</Button>
						</div>
					))}
				</div>
			</section>

			{/* 页脚 */}
			<footer className="mt-auto text-center text-xs text-muted-foreground pb-3">
				{t('discover.footer')}
			</footer>
		</main>
	);
}
