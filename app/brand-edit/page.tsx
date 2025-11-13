"use client";

import { Button } from '../../components/ui/button';
import { ArrowLeft, Upload, MapPin, Camera, ChevronLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth, useUserParams } from '../../contexts/AuthContext';
import { AuthGuard } from '../../components/AuthGuard';
import { updateUserBrand, uploadAvatar, getUserInfo } from '../../lib/auth';
import { classNames } from '../../lib/utils/classNames';
import { UI_CONSTANTS } from '../../lib/constants';
import { getCurrentLocationString } from '../../lib/utils/geolocation';
import { buildAvatarUrl } from '../../lib/api';

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
        location: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>('');
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(true);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const hasLoadedUserInfo = useRef(false);

    // 获取用户信息并预填充表单
    useEffect(() => {
        const fetchUserInfoAndPrefill = async () => {
            // 防止重复调用
            if (hasLoadedUserInfo.current) {
                return;
            }

            const email = getEmail();
            if (!email || !userParams) {
                setIsLoadingUserInfo(false);
                return;
            }

            hasLoadedUserInfo.current = true;

            try {
                const response = await getUserInfo({
                    email: email,
                    userId: userParams.userId,
                    token: userParams.token,
                });

                if (response.success && response.data) {
                    const userInfo = response.data;
                    // 预填充表单数据
                    setFormData({
                        brand: userInfo.brand || '',
                        brief: userInfo.brief || '',
                        logo: userInfo.logo || '',
                        officialsite: userInfo.officialsite || '',
                        tel: userInfo.tel || '',
                        address: userInfo.address || '',
                        location: userInfo.location || 'Istanbul'
                    });

                    // 如果有logo，设置预览
                    if (userInfo.logo) {
                        setLogoPreview(buildAvatarUrl(userInfo.logo));
                    }
                }
            } catch (error) {
                console.error('获取用户信息失败:', error);
                setError(t('brandEditPage.getUserInfoFailed'));
            } finally {
                setIsLoadingUserInfo(false);
            }
        };

        fetchUserInfoAndPrefill();
    }, [userParams?.userId, userParams?.token]); // 只依赖必要的值

    // 获取用户地理位置
    const getUserLocation = useCallback(async () => {
        setIsGettingLocation(true);
        setError(null);

        try {
            const locationString = await getCurrentLocationString({
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5分钟缓存
            });
            
            setFormData(prev => ({
                ...prev,
                location: locationString
            }));
        } catch (error) {
            console.error('获取位置失败:', error);
            let errorMessage = t('brandEditPage.locationFailed');
            
            // 根据错误类型设置不同的错误消息
            if (error && typeof error === 'object' && 'code' in error) {
                switch (error.code) {
                    case 1: // PERMISSION_DENIED
                        errorMessage = t('brandEditPage.locationPermissionDenied');
                        break;
                    case 2: // POSITION_UNAVAILABLE
                        errorMessage = t('brandEditPage.locationUnavailable');
                        break;
                    case 3: // TIMEOUT
                        errorMessage = t('brandEditPage.locationTimeout');
                        break;
                    case -1: // 浏览器不支持
                        errorMessage = t('brandEditPage.locationError');
                        break;
                }
            }
            
            setError(errorMessage);
        } finally {
            setIsGettingLocation(false);
        }
    }, [t]);

    // 处理输入变化
    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };


    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // 检查文件类型
        if (!file.type.startsWith('image/')) {
            setError(t('brandEditPage.invalidImageType'));
            return;
        }

        // 检查文件大小 (10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            setError(t('brandEditPage.imageTooLarge'));
            return;
        }

        setLogoFile(file);
        setUploadingLogo(true);
        setError(null);

        try {
            // 创建预览
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);

            // 上传图片
            const uploadResponse = await uploadAvatar(file);
            
            if (uploadResponse.success && uploadResponse.data) {
                const logoUrl = typeof uploadResponse.data === 'string' 
                    ? uploadResponse.data 
                    : uploadResponse.data.img;
                
                // 检查返回的图片路径是否为错误标识（如 /err2, /err 等）
                if (logoUrl && (logoUrl.startsWith('/err') || logoUrl.includes('error'))) {
                    throw new Error(t('brandEditPage.imageFormatNotSupported'));
                }
                
                if (logoUrl) {
                    setFormData(prev => ({
                        ...prev,
                        logo: logoUrl
                    }));
                    // 更新预览为完整URL
                    setLogoPreview(buildAvatarUrl(logoUrl));
                }
            } else {
                throw new Error(uploadResponse.message || t('brandEditPage.logoUploadFailed'));
            }
        } catch (error) {
            console.error('Logo upload failed:', error);
            setError(error instanceof Error ? error.message : t('brandEditPage.logoUploadFailed'));
            setLogoFile(null);
            setLogoPreview('');
        } finally {
            setUploadingLogo(false);
        }
    };

    // 提交表单
    const handleSubmit = async () => {
        if (!getEmail()) {
            setError(t('brandEditPage.loginRequired'));
            return;
        }

        // 验证品牌名称必填
        if (!formData.brand.trim()) {
            setError(t('brandEditPage.brandRequired'));
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
            <main className="flex min-h-dvh flex-col bg-white">
                {/* Header */}
                <Header
                    showLanguage
                />

                {/* Back button and title */}
                <div className="flex items-center justify-between px-6 py-4">
                    <h1 className="text-xl text-[#11295b] font-poppins">{t('brandEditPage.title')}</h1>
                    <button onClick={() => router.push('/personal')} className="text-[#11295b] hover:text-[#11295b]">
                    <ChevronLeft className={classNames(
                                    UI_CONSTANTS.SIZES.ICON_LG,
                                    UI_CONSTANTS.COLORS.PRIMARY
                                )} />
                    </button>
                </div>

                {isLoadingUserInfo ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#11295b] mx-auto mb-4"></div>
                            <p className="text-gray-500">{t('brandEditPage.loading')}</p>
                        </div>
                    </div>
                ) : (
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex-1 px-6 py-4 space-y-6">
                        {/* Brand Name */}
                        <div>
                            <input
                                type="text"
                                placeholder={t('brandEditPage.brand')}
                                value={formData.brand}
                                onChange={(e) => handleInputChange('brand', e.target.value)}
                                className="w-full rounded-full bg-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/60"
                                required
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
                            <label className={`w-20 h-20 flex flex-col items-center justify-center rounded-xl bg-gray-200 cursor-pointer relative overflow-hidden ${
                                uploadingLogo ? 'opacity-50 pointer-events-none' : ''
                            }`}>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    disabled={uploadingLogo}
                                />
                                
                                {logoPreview ? (
                                    <div className="w-full h-full relative">
                                        <img 
                                            src={logoPreview} 
                                            alt="Logo preview" 
                                            className="w-full h-full object-cover rounded-xl"
                                        />
                                        {uploadingLogo && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                <div className="text-white text-xs">{t('brandEditPage.uploading')}</div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <Camera className="h-8 w-8 text-gray-400 mt-2" />
                                        <span className="block mt-2 text-gray-500 text-sm font-normal">
                                            {uploadingLogo ? t('brandEditPage.uploading') : t('brandEditPage.logo')}
                                        </span>
                                    </div>
                                )}
                            </label>
                            
                            {/* Logo upload status */}
                            {logoFile && !uploadingLogo && formData.logo && (
                                <div className="mt-2 text-xs text-green-600">
                                    {t('brandEditPage.logoUploaded')}
                                </div>
                            )}
                        </div>

                        {/* Official Site */}
                        <div>
                            <input
                                type="text"
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
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-500">
                                <MapPin className="h-4 w-4" />
                                <span>{t('brandEditPage.location')}: {formData.location || t('brandEditPage.gettingLocation')}</span>
                            </div>
                            {!isGettingLocation && !formData.location && (
                                <button
                                    type="button"
                                    onClick={getUserLocation}
                                    className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1"
                                >
                                    <MapPin className="h-3 w-3" />
                                    {t('brandEditPage.getCurrentLocation')}
                                </button>
                            )}
                            {isGettingLocation && (
                                <div className="flex items-center gap-1 text-sm text-blue-500">
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                                    {t('brandEditPage.gettingLocation')}
                                </div>
                            )}
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
                            className="w-full bg-[#11295b] text-white shadow-md rounded-lg"
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
                )}

                <div className="mt-auto">
                    <Footer />
                </div>
            </main>
        </AuthGuard>
    );
}
