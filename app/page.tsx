"use client";

import { Button } from '../components/ui/button';
import { MapPin, Users, Settings, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import Link from 'next/link';

export default function HomePage() {
	const { t } = useLanguage();

	return (
		<main className="h-screen w-full overflow-hidden contain-page">
			{/* 全屏视频背景，靠上展示 */}
			<video
				src="/earth.mp4"
				autoPlay
				loop
				muted
				playsInline
				className="absolute top-0 left-0 right-0 -z-10 w-full h-auto max-h-screen object-cover"
				style={{ minHeight: '100vh' }}
			/>

			{/* 顶部导航 */}
			<div className="relative z-10">
				<Header transparent showUser showLanguage/>
			</div>

			{/* 主要内容区域 - 使用flex布局自适应屏幕 */}
			<div className="relative z-10 flex h-[calc(100vh-68px)] flex-col justify-between">
				{/* 空白区域 - 占据上半部分 */}
				<div className="flex-1"></div>

				{/* 核心文案与按钮 - 定位在下半部分 */}
				<div className="flex items-end justify-center pb-20">
					<div className="w-full max-w-md space-y-4 text-center">
						<h1 className="text-2xl font-bold tracking-tight text-white font-poppins">Spin. Discover. Connect.</h1>
						<div className="px-18 flex flex-col gap-4">
							<Link href="/square">
								<Button className="w-full btn-gradient text-white shadow-md h-10 font-nunito" size="lg">
									{t('buttons.spinToDiscover')}
								</Button>
							</Link>
							<Link href="/register">
								<Button className="w-full h-10 font-nunito" variant="outline" size="lg">
									{t('buttons.createAccount')}
								</Button>
							</Link>
						</div>
					</div>
				</div>


				{/* 页脚固定在底部 */}
				<div className="relative z-10 mt-auto pb-3 px-4">
					<Footer />
				</div>
				
			</div>

		</main>

	);
}
