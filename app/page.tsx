"use client";

import { Button } from '../components/ui/button';
import { MapPin, Users, Settings, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
	const { t } = useLanguage();

	return (
		<main className="relative h-screen w-full overflow-hidden contain-page">
			{/* 全屏GIF背景，靠上展示 */}
			<Image
				src="/img/earth.gif"
				alt="Earth background"
				fill
				priority
				className="object-cover"
				style={{ zIndex: -10, minHeight: '100vh' }}
				unoptimized
			/>

			{/* 顶部导航 */}
			<div className="relative z-10">
				<Header transparent showUser/>
			</div>

			{/* 主要内容区域 - 使用flex布局自适应屏幕 */}
			<div className="relative z-10 flex h-[calc(100vh-68px)] flex-col justify-between">
				{/* 空白区域 - 占据上半部分 */}
				<div className="flex-1"></div>

				{/* 核心文案与按钮 - 定位在下半部分 */}
				<div className="flex items-end justify-center pb-[30%]">
					<div className="w-full max-w-md space-y-4 text-center">
						<h1 className="text-3xl font-semibold tracking-tight text-white font-poppins mb-10">Spin. Discover. Connect.</h1>
						<div className="px-16 flex flex-col gap-4">
							<Link href="/square">
								<Button className="w-full mx-auto btn-gradient text-white shadow-md h-10 text-lg font-poppins text-[17px] font-semibold" size="lg">
									{t('buttons.spinToDiscover')}
								</Button>
							</Link>
							<Link href="/register">
								<Button className="w-full h-10 font-poppins text-[17px] font-semibold" variant="outline" size="lg">
									{t('buttons.createAccount')}
								</Button>
							</Link>
						</div>
					</div>
				</div>


				{/* 页脚固定在底部 */}
				<div className="relative z-10 mt-auto pb-3 ">
					<Footer  transparent/>
				</div>
				
			</div>

		</main>

	);
}
