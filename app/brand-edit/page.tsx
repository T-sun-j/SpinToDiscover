"use client";

import { Button } from '../../components/ui/button';
import { ArrowLeft, Upload, MapPin, Camera, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useAuth, useUserParams } from '../../contexts/AuthContext';
import { AuthGuard } from '../../components/AuthGuard';
import { updateUserBrand } from '../../lib/auth';
import { classNames } from '../../lib/utils/classNames';
import { UI_CONSTANTS } from '../../lib/constants';

export default function BrandEditPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const { getEmail } = useAuth();
    const { userParams } = useUserParams();
    
    // 表单状态
    const [formData, setFormData] = useState({
        brand: '',
        brief: '',
        logo: '',
        officialsite: '',
        tel: '',
        address: '',
        location: 'Istanbul'
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 处理输入变化
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // 这里可以处理文件上传逻辑
            // 暂时使用文件名作为占位符
            setFormData(prev => ({
                ...prev,
                logo: file.name
            }));
        }
    };

    // 提交表单
    const handleSubmit = async () => {
        if (!getEmail()) {
            setError(t('brandEditPage.loginRequired'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (!userParams) {
                setError(t('brandEditPage.authInfoMissing'));
                return;
            }

            const response = await updateUserBrand({
                email: getEmail()!,
                userId: userParams.userId,
                token: userParams.token,
                brand: formData.brand,
                brief: formData.brief,
                logo: formData.logo,
                officialsite: formData.officialsite,
                tel: formData.tel,
                address: formData.address,
                location: formData.location
            });

            if (response.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/personal');
                }, 2000);
            } else {
                setError(response.message || t('brandEditPage.submitError'));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : t('brandEditPage.submitError'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthGuard>
            <main className="container-page flex min-h-dvh flex-col bg-white">
                {/* Header */}
                <Header
                    showLanguage
                    showSearch
                    showUser
                />

                {/* Back button and title */}
                <div className="flex items-center justify-between px-6 py-4">
                    <h1 className="text-xl text-[#101729] font-poppins">{t('brandEditPage.title')}</h1>
                    <button onClick={() => router.push('/personal')} className="text-[#101729] hover:text-[#101729]">
                    <ChevronLeft className={classNames(
                                    UI_CONSTANTS.SIZES.ICON_LG,
                                    UI_CONSTANTS.COLORS.PRIMARY
                                )} />
                    </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex-1 px-6 py-4 space-y-6">
                        {/* Brand Name */}
                        <div>
                            <input
                                type="text"
                                placeholder={t('brandEditPage.brand')}
                                value={formData.brand}
                                onChange={(e) => handleInputChange('brand', e.target.value)}
                                className="w-full rounded-full bg-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/60"
                            />
                        </div>

                        {/* Brief */}
                        <div>
                            <textarea
                                placeholder={t('brandEditPage.brief')}
                                value={formData.brief}
                                onChange={(e) => handleInputChange('brief', e.target.value)}
                                rows={4}
                                className="w-full rounded-lg bg-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/60"
                            />
                        </div>

                        {/* Logo Upload */}
                        <div className="flex flex-col items-start">
                            <label className="w-20 h-20 flex flex-col items-center justify-center rounded-xl bg-gray-200 cursor-pointer relative">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <div className="flex flex-col items-start">
                                    {/* Camera icon in outline, plus at top right */}
                                    <Camera className="h-8 w-8 text-gray-400 mt-2" />
                                    <span className="block mt-2 text-gray-500 text-sm font-normal">{t('brandEditPage.logo')}</span>
                                </div>
                            </label>
                        </div>

                        {/* Official Site */}
                        <div>
                            <input
                                type="url"
                                placeholder={t('brandEditPage.officialSite')}
                                value={formData.officialsite}
                                onChange={(e) => handleInputChange('officialsite', e.target.value)}
                                className="w-full rounded-full bg-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/60"
                            />
                        </div>

                        {/* Tel/Mobile */}
                        <div>
                            <input
                                type="tel"
                                placeholder={t('brandEditPage.telMobile')}
                                value={formData.tel}
                                onChange={(e) => handleInputChange('tel', e.target.value)}
                                className="w-full rounded-full bg-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/60"
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <textarea
                                placeholder={t('brandEditPage.address')}
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                rows={3}
                                className="w-full rounded-lg bg-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/60"
                            />
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-gray-500">
                            <MapPin className="h-4 w-4" />
                            <span>{t('brandEditPage.location')}: {formData.location}</span>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 text-red-500 text-sm">
                                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="flex items-center gap-2 text-green-500 text-sm">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span>{t('brandEditPage.submitSuccess')}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-[#101729] text-white shadow-md rounded-lg"
                            size="lg"
                            disabled={loading || !!success}
                        >
                            {loading 
                                ? t('brandEditPage.submitting')
                                : success 
                                    ? t('brandEditPage.submit')
                                    : t('brandEditPage.submit')
                            }
                        </Button>
                </form>

                <div className="mt-auto">
                    <Footer />
                </div>
            </main>
        </AuthGuard>
    );
}
