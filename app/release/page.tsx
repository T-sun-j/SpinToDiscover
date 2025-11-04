"use client";

import { Button } from '../../components/ui/button';
import { ChevronLeft, Camera, MapPin, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { AuthGuard } from '../../components/AuthGuard';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { postSquareContent, getUserInfo, uploadAvatar, uploadVideo } from '../../lib/auth';
import { PostSquareRequest } from '../../lib/api';
import { LoadingSpinner } from '../../components/ui/LoadingStates';

export default function ReleasePage() {
  const { t, language } = useLanguage();
  const { authInfo, isAuthenticated } = useAuth();
  const router = useRouter();
  const [brandInfoChecked, setBrandInfoChecked] = useState(false);
  const [images, setImages] = useState<string[]>([]); // Placeholder image
  const [imageFiles, setImageFiles] = useState<File[]>([]); // Store image files
  const [videoFile, setVideoFile] = useState<File | null>(null); // Store video file
  const [videoUrl, setVideoUrl] = useState<string | null>(null); // Store video URL for display
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [brandName, setBrandName] = useState('');
  const [briefDescription, setBriefDescription] = useState('');
  const [userBrandInfo, setUserBrandInfo] = useState<any>(null); // 存储完整的用户品牌信息
  const [allowingComments, setAllowingComments] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [userLocation, setUserLocation] = useState<string>('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Get user location
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setErrorMessage(t('releasePage.locationError'));
      return;
    }

    setIsGettingLocation(true);
    setErrorMessage('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // 根据当前语言模式决定使用中文还是英文地址
          const localityLanguage = language === 'en' ? 'en' : 'zh';

          // Use reverse geocoding to get address information
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=${localityLanguage}`
          );

          if (response.ok) {
            const data = await response.json();
            // 根据语言模式格式化地址
            let locationString;
            if (localityLanguage === 'en') {
              // 英文模式：使用英文地址格式
              locationString = `${data.countryName || ''}, ${data.city || data.locality || ''}`;
            } else {
              // 中文模式：使用中文地址格式
              locationString = `${data.countryName || ''}，${data.city || data.locality || ''}`;
            }
            setUserLocation(locationString);
          } else {
            setUserLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } catch (error) {
          console.error('Failed to get address info:', error);
          setUserLocation(t('releasePage.locationParseError'));
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error('Failed to get location:', error);
        let errorMessage = t('releasePage.locationFailed');
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = t('releasePage.locationPermissionDenied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = t('releasePage.locationUnavailable');
            break;
          case error.TIMEOUT:
            errorMessage = t('releasePage.locationTimeout');
            break;
        }
        setErrorMessage(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes cache
      }
    );
  }, [language]);

  // Auto get location when component loads
  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  // Clean up video URL when component unmounts
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  // Get user info and populate brand fields
  const fetchUserInfo = useCallback(async () => {
    if (!authInfo) {
      setErrorMessage(t('releasePage.authInfoMissing'));
      return;
    }

    try {
      const response = await getUserInfo({
        email: authInfo.email,
        userId: authInfo.userId,
        token: authInfo.token,
      });

      if (response.success && response.data) {
        const userInfo = response.data;
        // 保存完整的用户品牌信息
        setUserBrandInfo(userInfo);
        
        // Populate brand name and description for display
        if (userInfo.brand) {
          setBrandName(userInfo.brand);
        }
        if (userInfo.brief) {
          setBriefDescription(userInfo.brief);
        }
      }
    } catch (error) {
      console.error('Failed to get user info:', error);
      setErrorMessage(t('releasePage.getUserInfoFailed'));
    }
  }, [authInfo]);

  // Validate form data
  const validateForm = useCallback(() => {
    if (!title.trim()) {
      setErrorMessage(t('releasePage.titleRequired'));
      return false;
    }
    // 内容字段不再必填，移除验证
    return true;
  }, [title, t]);

  const handleBack = () => {
    router.back();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFiles([...imageFiles, file]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages([...images, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // Check if video file already exists
      if (videoFile) {
        setErrorMessage(t('releasePage.onlyOneVideoAllowed'));
        return;
      }
      setVideoFile(file);
      // Create video URL for display
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = () => {
    // Clean up video URL
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoFile(null);
    setVideoUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Validate required fields
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }

      let uploadedImages: string[] = [];
      let uploadedVideo: string = '';

      // Upload images first
      if (imageFiles.length > 0) {
        setSuccessMessage(t('releasePage.uploadingImages'));
        for (const imageFile of imageFiles) {
          try {
            const uploadResponse = await uploadAvatar(imageFile);
            if (uploadResponse.success && uploadResponse.data) {
              const imageUrl = typeof uploadResponse.data === 'string'
                ? uploadResponse.data
                : uploadResponse.data.img;
              if (imageUrl) {
                uploadedImages.push(imageUrl);
              }
            }
          } catch (error) {
            console.error('Image upload failed:', error);
            setErrorMessage(`${t('releasePage.imageUploadError')}: ${error instanceof Error ? error.message : t('releasePage.unknownError')}`);
            setSuccessMessage(''); // Clear success message
            setIsSubmitting(false);
            return;
          }
        }
      }

      // Then upload video
      if (videoFile) {
        setSuccessMessage(t('releasePage.uploadingVideo'));
        try {
          const videoUploadResponse = await uploadVideo(videoFile);
          if (videoUploadResponse.success && videoUploadResponse.data?.code === 0) {
            uploadedVideo = videoUploadResponse.data.url;
          } else {
            throw new Error(videoUploadResponse.data?.msg || 'Video upload failed');
          }
        } catch (error) {
          console.error('Video upload failed:', error);
          setErrorMessage(`${t('releasePage.videoUploadError')}: ${error instanceof Error ? error.message : t('releasePage.unknownError')}`);
          setSuccessMessage(''); // Clear success message
          setIsSubmitting(false);
          return;
        }
      }

      // Prepare post data
      const postData: PostSquareRequest = {
        userId: authInfo!.userId,
        token: authInfo!.token,
        title: title.trim(),
        description: content.trim(),
        location: userLocation || t('releasePage.gettingLocation'),
        images: uploadedImages.join(','),
        video: uploadedVideo ? '/' + uploadedVideo : '',
        intro: brandInfoChecked ? (userBrandInfo?.brief || briefDescription) : '',
        website: brandInfoChecked ? (userBrandInfo?.officialsite || '') : '',
        logo: brandInfoChecked ? (userBrandInfo?.logo || '') : '',
        customerService: brandInfoChecked ? (userBrandInfo?.tel || '') : '',
        workingHours: brandInfoChecked ? (userBrandInfo?.address || '') : '',
      };

      setSuccessMessage(t('releasePage.publishingContent'));

      // Call publish API
      const response = await postSquareContent(postData);

      if (response.success) {
        setSuccessMessage(t('releasePage.publishSuccess'));
        // Redirect to personal page after success
        setTimeout(() => {
          router.push('/personal');
        }, 2000);
      } else {
        setErrorMessage(response.message || t('releasePage.publishError'));
        setSuccessMessage(''); // Clear success message
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t('releasePage.publishProcessError'));
      setSuccessMessage(''); // 清除成功消息
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-xl text-[#101729] font-poppins">{t('releasePage.title')}</h1>
          <button onClick={handleBack} className="text-[#101729] hover:text-[#101729]">
            <ChevronLeft className="h-7 w-7" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 px-6 space-y-6">
          {/* Title Input */}
          <div>
            <input
              type="text"
              placeholder={t('releasePage.fieldTitle')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-full bg-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/60"
              required
            />
          </div>

          {/* Content Textarea */}
          <div>
            <textarea
              placeholder={t('releasePage.fieldContent')}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full rounded-lg bg-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          </div>

          {/* Media upload area */}
          <div>

            {/* Media files grid layout - 4 per row */}
            <div className="grid grid-cols-4 gap-3">
              {/* Display uploaded images */}
              {images.map((image, index) => (
                <div key={`image-${index}`} className="relative aspect-square rounded-lg overflow-hidden border border-gray-300">
                  <Image src={image} alt="Uploaded" layout="fill" objectFit="cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {/* 显示已上传视频 */}
              {videoFile && videoUrl && (
                <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
                  <video
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                    onLoadedMetadata={(e) => {
                      // 设置视频到第一帧
                      e.currentTarget.currentTime = 0.1;
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveVideo}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {/* 上传按钮 - 只在还有空间时显示 */}
              {(images.length + (videoFile ? 1 : 0)) < 8 && (
                <label className="aspect-square flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <input
                    type="file"
                    accept={videoFile ? "image/*" : "image/*,video/*"}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.type.startsWith('image/')) {
                        handleImageUpload(e);
                      } else if (file.type.startsWith('video/')) {
                        // Check if video file already exists
                        if (videoFile) {
                          setErrorMessage(t('releasePage.onlyOneVideoAllowed'));
                          e.target.value = ""; // 重置input
                          return;
                        }
                        handleVideoUpload(e);
                      }
                      // 重置input，否则无法重复选同一文件
                      e.target.value = "";
                    }}
                  />
                  <div className="flex flex-col items-center">
                    <Camera className="h-6 w-6 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500 text-center">
                      {videoFile ? t('releasePage.addImage') : t('releasePage.addMedia')}
                    </span>
                  </div>
                </label>
              )}
            </div>

            {/* 媒体文件数量提示 */}
            <div className="mt-2 text-xs text-gray-500">
              {images.length + (videoFile ? 1 : 0)}/8 {t('releasePage.mediaFiles')}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="h-4 w-4" />
              <span>{t('releasePage.location')}: {userLocation || t('releasePage.gettingLocation')}</span>
            </div>
            {!userLocation && !isGettingLocation && (
              <button
                type="button"
                onClick={getUserLocation}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                {t('releasePage.retryLocation')}
              </button>
            )}
          </div>

          {/* Advantage Info Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg text-[#101729] font-poppins">{t('releasePage.advantageInfo')}</h2>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={brandInfoChecked}
                  onChange={async (e) => {
                    const isChecked = e.target.checked;
                    setBrandInfoChecked(isChecked);

                    // 如果勾选了品牌信息，则获取用户信息并填充
                    if (isChecked) {
                      await fetchUserInfo();
                    } else {
                      // 如果取消勾选，清空品牌信息
                      setBrandName('');
                      setBriefDescription('');
                      setUserBrandInfo(null);
                    }
                  }}
                  className="form-checkbox h-4 w-4 rounded-sm border-gray-400 text-[#101729] focus:ring-[#101729]"
                />
                <span className="text-sm text-gray-600">{t('releasePage.fillBrandInfo')}</span>
              </div>
            </div>

            {/* {brandInfoChecked && ( */}
            <div className="space-y-4">
              {/* Brand/Production Name */}
              <div>
                <input
                  type="text"
                  placeholder={t('releasePage.brandProductionName')}
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full rounded-full bg-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/60"
                />
              </div>

              {/* Brief Description */}
              <div>
                <textarea
                  placeholder={t('releasePage.briefDescription')}
                  value={briefDescription}
                  onChange={(e) => setBriefDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg bg-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/60"
                />
              </div>
            </div>
            {/* )} */}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {/* {successMessage && (
            <div className="flex items-center gap-2 text-green-500 text-sm">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>{successMessage}</span>
            </div>
          )} */}

          {/* Allowing Comments Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={allowingComments}
              onChange={(e) => setAllowingComments(e.target.checked)}
              className={`form-checkbox h-4 w-4 rounded-sm border-gray-400 ${
                allowingComments
                  ? 'bg-[#101729] text-white border-[#101729]'
                  : 'bg-gray-200 text-[#101729] border-gray-400'
              } focus:ring-[#101729] transition-colors`}
            />
            <span className="text-gray-700 text-sm">{t('releasePage.allowingComments')}</span>
          </div>

          {/* Release Button */}
          <Button
            type="submit"
            className="w-full bg-[#101729] text-white shadow-md rounded-lg"
            size="lg"
            disabled={isSubmitting || (!!successMessage && !errorMessage)}
          >
            {isSubmitting
              ? t('releasePage.publishing')
              : (successMessage && !errorMessage)
                ? t('releasePage.publishSuccess')
                : t('releasePage.releaseButton')
            }
          </Button>
        </form>

        {/* Footer */}
        <Footer />
      </main>
    </AuthGuard>
  );
}

