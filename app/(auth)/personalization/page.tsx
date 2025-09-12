"use client";

import { Button } from '../../../components/ui/button';
import { UserRound, Upload, ArrowLeft, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function PersonalizationPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        avatar: null as File | null,
        nickname: '',
        avatarPreview: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 生成随机昵称
    const generateRandomNickname = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData({ ...formData, nickname: result });
    };

    // 处理头像上传
    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // 验证文件类型
            if (!file.type.startsWith('image/')) {
                setErrorMessage(t('personalization.errorMessage'));
                return;
            }

            // 验证文件大小 (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrorMessage(t('personalization.errorMessage'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData({
                    ...formData,
                    avatar: file,
                    avatarPreview: e.target?.result as string
                });
                setErrorMessage('');
            };
            reader.readAsDataURL(file);
        }
    };

    // 处理提交
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            // 如果没有设置昵称，生成随机昵称
            const finalNickname = formData.nickname || generateRandomNickname();

            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 跳转到个人中心页面
            router.push('/settings');
        } catch (error) {
            setErrorMessage(t('personalization.errorMessage'));
        } finally {
            setIsSubmitting(false);
        }
    };

    // 处理跳过
    const handleSkip = () => {
        router.push('/settings');
    };

    // 处理返回
    const handleBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <main className=" flex min-h-[100vh] flex-col">
                {/* 使用公共头部组件 */}
                <Header
                    showLanguage
                />

                {/* 页面标题和返回按钮 */}
                <div className="flex items-center justify-between px-6 py-4">
                    <h1 className="text-xl font-semibold text-[#093966]">{t('personalization.title')}</h1>
                    <button
                        onClick={handleBack}
                        className="text-[#093966] hover:text-[#093966]"
                    >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                {/* 个人化表单 */}
                <form onSubmit={handleSubmit} className="flex-1 space-y-6 px-6">
                    {/* 头像上传区域 */}
                    <div className="flex flex-col items-center space-y-4">
                        <div
                            className="w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-[#093966] transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {formData.avatarPreview ? (
                                <img
                                    src={formData.avatarPreview}
                                    alt="Avatar preview"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                <UserRound className="w-16 h-16 text-gray-400" />
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                        />
                        <p className="text-md text-gray-500 font-bold">{t('personalization.clickToUpload')}</p>
                    </div>

                    {/* 昵称输入 */}
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={formData.nickname}
                            onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                            placeholder={t('personalization.nicknamePlaceholder')}
                            className="w-full rounded-lg bg-gray-100 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#093966]/60"
                        />
                    </div>

                    {/* 错误信息显示 */}
                    {errorMessage && (
                        <div className="flex items-center gap-2 text-red-500 text-sm">
                            <RefreshCw className="h-4 w-4" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* 提交按钮 */}
                    <Button
                        type="submit"
                        className="w-full bg-[#093966] text-white shadow-md rounded-lg"
                        size="lg"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? t('personalization.submitting') : t('personalization.submit')}
                    </Button>

                    {/* 跳过按钮 */}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleSkip}
                            className="flex items-center text-md text-gray-600 hover:text-gray-800 font-bold"
                        >
                            {t('personalization.skip')}
                            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </form>

                {/* 使用公共页脚组件 */}
                <Footer />
            </main>
        </div>
    );
}
