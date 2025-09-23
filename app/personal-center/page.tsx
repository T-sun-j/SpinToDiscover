"use client";

import { Button } from '../../components/ui/button';
import { ArrowLeft, RotateCcw, Settings, CirclePlus, Bell, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function PersonalCenterPage() {
    const { t } = useLanguage();
    const router = useRouter();
    return (
        <main className="flex min-h-dvh flex-col bg-white">
            {/* Header with logo and language toggle */}
            <Header
                showLanguage
                logoLink="/square"
            />

            {/* 页面标题和返回按钮 */}
            <div className="flex items-center justify-between px-6 py-4">
                <h1 className="text-xl text-[#101729]">{t('personalCenter.title')}</h1>
                <button
                    onClick={() => router.push('/square')}
                    className="text-[#101729] hover:text-[#101729]"
                >
                    <ChevronLeft className="h-7 w-7" />
                </button>
            </div>

            {/* User profile section */}
            <div className="px-6 py-4">
                <div className="flex items-center gap-4">
                    {/* Profile picture */}
                    <div className="relative">
                        <Image
                            src="/img/avatar.png" // Placeholder - in real app this would be user's avatar
                            alt="Profile"
                            width={12}
                            height={12}
                            className="rounded-full h-8 w-8 object-cover"
                        />
                    </div>

                    {/* Username */}
                    <div className="flex-1 flex items-center">
                        <h2 className="text-lg text-[#101729] font-poppins flex items-center gap-1">
                            Miaham
                            <Link href="/personalization">
                                <Button variant="ghost" size="icon" className="text-[#101729] p-1 h-7 w-7">
                                    <RotateCcw className="h-5 w-5" />
                                </Button>
                            </Link>
                        </h2>
                    </div>

                    {/* Edit and Settings buttons */}
                    <div className="flex items-center gap-2">

                        <Link href="/settings">
                            <Button variant="ghost" size="icon" className="text-[#101729]">
                                <Settings className="h-7 w-7" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Menu items */}
            <div className="flex-1 px-6 py-4">
                <div className="space-y-4">
                    <Link href="/personal">
                        <Button
                            variant="ghost"
                            className="w-full justify-start bg-[#101729] text-white h-14 rounded-xl font-nunito text-lg font-bold"
                        >
                            {t('personalCenter.menu.myPage')}
                        </Button>
                    </Link>
                    <div className="h-2" />
                    <Link href="/followed">
                        <Button
                            variant="ghost"
                            className="w-full justify-start bg-[#101729] text-white h-14 rounded-xl font-nunito text-lg font-bold"
                        >
                            {t('personalCenter.menu.followed')}
                        </Button>
                    </Link>
                    <div className="h-2" />
                    <Link href="/history">
                        <Button
                            variant="ghost"
                            className="w-full justify-start bg-[#101729] text-white h-14 rounded-xl font-nunito text-lg font-bold"
                        >
                            {t('personalCenter.menu.history')}
                        </Button>
                    </Link>
                    <div className="h-2" />
                    <Link href="/favorite">
                        <Button
                            variant="ghost"
                            className="w-full justify-start bg-[#101729] text-white h-14 rounded-xl font-nunito text-lg font-bold"
                        >
                            {t('personalCenter.menu.favorites')}
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Post button and notifications */}
            <div className="px-6 py-4">
                <div className="flex items-center justify-center gap-4">
                    {/* Post button */}
                    <Link href="/release">
                        <Button
                            className="bg-white text-[#101729] rounded-full h-16 w-16 flex flex-col items-center justify-center gap-1 font-nunito text-lg font-bold "
                            size="lg"
                        >
                            <CirclePlus className="h-48 w-48" />
                            <span className="text-xs font-semibold">{t('personalCenter.post.button')}</span>
                        </Button>
                    </Link>

                </div>
            </div>

            {/* Footer */}
            <div className="mt-auto">
                <Footer />
            </div>
        </main>
    );
}
