"use client";

import { Button } from '../../../components/ui/button';
import { UserRound, Upload, ArrowLeft, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getUserInfo, updateUserInfo, uploadAvatar } from '../../../lib/auth';
import { useAuth } from '../../../contexts/AuthContext';
import { buildAvatarUrl } from '../../../lib/api';

export default function PersonalizationPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { authInfo, isAuthenticated } = useAuth();
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
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    // 默认值
    const DEFAULT_AVATAR = '/img/avatar.png';
    const DEFAULT_NICKNAME = 'User';

    // 初始化页面
    useEffect(() => {
        const from = searchParams.get('from'); // 检查来源参数
        
        // 判断是否来自注册流程
        setIsFromRegistration(from === 'register');
        
        if (isAuthenticated && authInfo) {
            // 如果有认证信息，设置用户参数但不立即获取用户信息
            setUserParams({ 
                email: authInfo.email, 
                userId: authInfo.userId, 
                token: authInfo.token 
            });
            
            // 如果不是来自注册流程，才获取用户信息
            if (from !== 'register') {
                loadUserInfo(authInfo.email, authInfo.userId, authInfo.token);
            } else {
                // 来自注册流程，生成随机昵称
                generateRandomNickname();
            }
        } else {
            // 如果没有认证信息，生成随机昵称
            generateRandomNickname();
        }
    }, [searchParams, isAuthenticated, authInfo]);

    // 获取用户信息
    const loadUserInfo = async (email: string, userId: string, token: string) => {
        setIsLoading(true);
        try {
            const response = await getUserInfo({ email, userId, token });
            if (response.success && response.data) {
                setFormData(prev => ({
                    ...prev,
                    nickname: response.data!.nickname || '',
                    avatarPreview: buildAvatarUrl(response.data!.avatar, '')
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
            // 如果没有设置昵称，使用默认昵称
            let finalNickname = formData.nickname || DEFAULT_NICKNAME;
            let finalAvatar = formData.avatarPreview || DEFAULT_AVATAR;

            // 如果有用户参数，调用更新用户信息API
            if (userParams.email && userParams.userId && userParams.token) {
                // 如果用户上传了头像，先上传头像
                if (formData.avatar) {
                    setIsUploadingAvatar(true);
                    try {
                        const uploadResponse = await uploadAvatar(formData.avatar);
                        if (uploadResponse.success && uploadResponse.data?.img) {
                            finalAvatar = uploadResponse.data.img;
                        } else {
                            setErrorMessage(t('auth.avatarUploadError'));
                            return;
                        }
                    } catch (uploadError) {
                        setErrorMessage(t('auth.avatarUploadError'));
                        return;
                    } finally {
                        setIsUploadingAvatar(false);
                    }
                }

                const response = await updateUserInfo(
                    userParams.email,
                    userParams.userId,
                    userParams.token,
                    finalNickname,
                    finalAvatar,
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
                // 如果没有用户参数，显示错误信息
                setErrorMessage(t('auth.noAuthInfo'));
            }
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : t('auth.updateUserInfoError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    // 处理跳过
    const handleSkip = async () => {
        if (!userParams.email || !userParams.userId || !userParams.token) {
            setErrorMessage(t('auth.noAuthInfo'));
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // 上传默认头像
            setIsUploadingAvatar(true);
            let finalAvatar = DEFAULT_AVATAR;
            
            try {
                // 获取默认头像文件
                const defaultAvatarFile = await getDefaultAvatarFile();
                if (defaultAvatarFile) {
                    const uploadResponse = await uploadAvatar(defaultAvatarFile);
                    if (uploadResponse.success && uploadResponse.data?.img) {
                        finalAvatar = uploadResponse.data.img;
                    }
                }
            } catch (uploadError) {
                console.log('Failed to upload default avatar, using fallback:', uploadError);
                // 如果上传失败，继续使用默认路径
            } finally {
                setIsUploadingAvatar(false);
            }

            // 使用默认头像和昵称更新用户信息
            const response = await updateUserInfo(
                userParams.email,
                userParams.userId,
                userParams.token,
                DEFAULT_NICKNAME,
                finalAvatar,
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
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : t('auth.updateUserInfoError'));
        } finally {
            setIsSubmitting(false);
        }
    };

    // 获取默认头像文件
    const getDefaultAvatarFile = async (): Promise<File | null> => {
        try {
            // 从public目录获取默认头像
            const response = await fetch('/img/avatar.png');
            if (!response.ok) {
                return null;
            }
            
            const blob = await response.blob();
            const file = new File([blob], 'avatar.png', { type: 'image/png' });
            return file;
        } catch (error) {
            console.log('Failed to load default avatar file:', error);
            return null;
        }
    };

    // 处理返回
    const handleBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-white ">
            <main className="w-full flex min-h-[100vh] flex-col">
                {/* 使用公共头部组件 */}
                <Header/>

                {/* 页面标题和返回按钮 */}
                <div className="flex items-center justify-between px-2 py-4 z-100 mx-2">
                    <h1 className="text-xl font-poppins text-[#0F1728] font-semibold">{t('personalization.title')}</h1>
                    <button
                        onClick={handleBack}
                        className="text-[#0F1728] hover:text-[#0F1728]" 
                    >
                        <ChevronLeft className="w-7 h-7 z-100" />
                    </button>
                </div>

                {/* 个人化表单 */}
                <form onSubmit={handleSubmit} className="flex-1 space-y-6 px-2 font-inter mx-2">
                    {/* 头像上传区域 */}
                    <div className="flex flex-col items-center space-y-4">
                        <div
                            className="w-48 h-48 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer border-2 border-gray-300 hover:border-[#11295b] transition-colors"
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
                        <p className="text-[17px] text-[#0F1728] font-nunito">{t('personalization.clickToUpload')}</p>
                    </div>

                    {/* 昵称输入 */}
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={formData.nickname}
                            onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                            placeholder={t('personalization.nicknamePlaceholder')}
                            className="w-full rounded-full bg-gray-100 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#11295b]/60"
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
                            <span>{t('common.loading')}</span>
                        </div>
                    )}

                    {/* 提交按钮 */}
                    <Button
                        type="submit"
                        className="w-full bg-[#11295b] text-white shadow-md rounded-lg text-[17px] font-poppins font-semibold"
                        size="lg"
                        disabled={isSubmitting || isUploadingAvatar || !!successMessage}
                    >
                        {isUploadingAvatar 
                            ? t('auth.avatarUploading')
                            : isSubmitting 
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
                                disabled={isSubmitting || isUploadingAvatar || !!successMessage}
                                className={`flex items-center text-[17px] font-semibold font-poppins ${
                                    isSubmitting || isUploadingAvatar || successMessage
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                {isUploadingAvatar 
                                    ? t('auth.avatarUploading')
                                    : isSubmitting 
                                        ? t('auth.skipping') 
                                        : t('personalization.skip')
                                }
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
