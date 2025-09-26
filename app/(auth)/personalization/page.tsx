"use client";

import { Button } from '../../../components/ui/button';
import { UserRound, Upload, ArrowLeft, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getUserInfo, updateUserInfo } from '../../../lib/auth';

export default function PersonalizationPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        avatar: null as File | null,
        nickname: '',
        avatarPreview: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userParams, setUserParams] = useState({
        email: '',
        userId: '',
        token: ''
    });
    const [isFromRegistration, setIsFromRegistration] = useState(false);

    // 从URL参数中获取用户信息
    useEffect(() => {
        const email = searchParams.get('email');
        const userId = searchParams.get('userId');
        const token = searchParams.get('token');
        const from = searchParams.get('from'); // 检查来源参数
        
        // 判断是否来自注册流程
        setIsFromRegistration(from === 'register' || (!email && !userId && !token));
        
        if (email && userId && token) {
            setUserParams({ email, userId, token });
            // 获取用户信息
            loadUserInfo(email, userId, token);
        } else {
            // 如果没有参数，生成随机昵称
            generateRandomNickname();
        }
    }, [searchParams]);

    // 获取用户信息
    const loadUserInfo = async (email: string, userId: string, token: string) => {
        setIsLoading(true);
        try {
            const response = await getUserInfo(email, userId, token);
            if (response.success && response.data) {
                setFormData(prev => ({
                    ...prev,
                    nickname: response.data.nickname || '',
                    avatarPreview: response.data.avatar || ''
                }));
            }
        } catch (error) {
            console.log('Failed to load user info:', error);
            // 如果获取失败，生成随机昵称
            generateRandomNickname();
        } finally {
            setIsLoading(false);
        }
    };

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
                setErrorMessage(t('auth.fileTypeError'));
                return;
            }

            // 验证文件大小 (5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrorMessage(t('auth.fileSizeError'));
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
        setSuccessMessage('');

        try {
            // 如果没有设置昵称，生成随机昵称
            let finalNickname = formData.nickname;
            if (!finalNickname) {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                let result = '';
                for (let i = 0; i < 8; i++) {
                    result += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                finalNickname = result;
            }

            // 如果有用户参数，调用更新用户信息API
            if (userParams.email && userParams.userId && userParams.token) {
                const response = await updateUserInfo(
                    userParams.email,
                    userParams.userId,
                    userParams.token,
                    finalNickname,
                    formData.avatarPreview,
                    'en'
                );

                if (response.success) {
                    setSuccessMessage(t('auth.updateUserInfoSuccess'));
                    // 成功后跳转到个人中心页面
                    setTimeout(() => {
                        router.push('/personal-center');
                    }, 2000);
                } else {
                    setErrorMessage(response.message || t('auth.updateUserInfoError'));
                }
            } else {
                // 如果没有用户参数，直接跳转（新用户注册流程）
                // router.push('/personal-center');
            }
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : t('auth.updateUserInfoError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    // 处理跳过
    const handleSkip = () => {
        router.push('/personal-center');
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
                    <h1 className="text-xl font-poppins text-[#101729]">{t('personalization.title')}</h1>
                    <button
                        onClick={handleBack}
                        className="text-[#101729] hover:text-[#101729]" 
                    >
                        <ChevronLeft className="w-7 h-7" />
                    </button>
                </div>

                {/* 个人化表单 */}
                <form onSubmit={handleSubmit} className="flex-1 space-y-6 px-6 font-inter">
                    {/* 头像上传区域 */}
                    <div className="flex flex-col items-center space-y-4">
                        <div
                            className="w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-[#101729] transition-colors"
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
                        <p className="text-md text-[#101729] font-bold">{t('personalization.clickToUpload')}</p>
                    </div>

                    {/* 昵称输入 */}
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={formData.nickname}
                            onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                            placeholder={t('personalization.nicknamePlaceholder')}
                            className="w-full rounded-lg bg-gray-100 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#101729]/60"
                        />
                    </div>

                    {/* 错误信息显示 */}
                    {errorMessage && (
                        <div className="flex items-center gap-2 text-red-500 text-sm font-inter">
                            <RefreshCw className="h-4 w-4" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* 成功信息显示 */}
                    {successMessage && (
                        <div className="flex items-center gap-2 text-green-500 text-sm font-inter">
                            <UserRound className="h-4 w-4" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* 加载状态显示 */}
                    {isLoading && (
                        <div className="flex items-center gap-2 text-blue-500 text-sm font-inter">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Loading user info...</span>
                        </div>
                    )}

                    {/* 提交按钮 */}
                    <Button
                        type="submit"
                        className="w-full bg-[#101729] text-white shadow-md rounded-lg font-nunito font-bold"
                        size="lg"
                        disabled={isSubmitting || !!successMessage}
                    >
                        {isSubmitting 
                            ? t('personalization.submitting') 
                            : successMessage 
                                ? t('auth.updateUserInfoSuccess')
                                : t('personalization.submit')
                        }
                    </Button>

                    {/* 跳过按钮 - 仅在注册流程中显示 */}
                    {isFromRegistration && (
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleSkip}
                                className="flex items-center text-md text-gray-600 hover:text-gray-800 font-bold font-nunito"
                            >
                                {t('personalization.skip')}
                                <ChevronRight className="w-5 h-5 ml-1" />
                            </button>
                        </div>
                    )}
                </form>

                {/* 使用公共页脚组件 */}
                <Footer />
            </main>
        </div>
    );
}
