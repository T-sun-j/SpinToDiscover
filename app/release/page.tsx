"use client";

import { Button } from '../../components/ui/button';
import { ChevronLeft, Camera, MapPin, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { postSquareContent } from '../../lib/auth';
import { PostSquareRequest } from '../../lib/api';
import { LoadingSpinner } from '../../components/ui/LoadingStates';

export default function ReleasePage() {
  const { t } = useLanguage();
  const { authInfo, isAuthenticated } = useAuth();
  const router = useRouter();
  const [brandInfoChecked, setBrandInfoChecked] = useState(false);
  const [images, setImages] = useState<string[]>(['/img/band.png']); // Placeholder image
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [brandName, setBrandName] = useState('');
  const [briefDescription, setBriefDescription] = useState('');
  const [allowingComments, setAllowingComments] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  // 验证表单数据
  const validateForm = useCallback(() => {
    if (!title.trim()) {
      setErrorMessage('标题不能为空');
      return false;
    }
    if (!content.trim()) {
      setErrorMessage('内容不能为空');
      return false;
    }
    return true;
  }, [title, content]);

  const handleBack = () => {
    router.back();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages([...images, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // 验证必填字段
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }

      // 准备发布数据
      const postData: PostSquareRequest = {
        userId: authInfo!.userId,
        token: authInfo!.token,
        title: title.trim(),
        description: content.trim(),
        location: '中国，北京', // 可以从用户位置获取
        images: images.filter(img => img !== '/img/band.png').join(','), // 过滤掉占位图片
        intro: brandInfoChecked ? briefDescription : '',
        // 其他可选字段可以根据需要添加
      };

      // 调用发布API
      const response = await postSquareContent(postData);

      if (response.success) {
        setSuccessMessage('发布成功！');
        // 成功后跳转到广场页面
        setTimeout(() => {
          router.push('/square');
        }, 2000);
      } else {
        setErrorMessage(response.message || '发布失败，请重试');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '发布过程中发生错误');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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

      <form onSubmit={handleSubmit} className="flex-1 px-6 py-4 space-y-6">
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
            required
          />
        </div>

        {/* Image Upload */}
        <div className="flex items-center gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-300">
              <Image src={image} alt="Uploaded" layout="fill" objectFit="cover" />
              {index !== 0 && ( // Only show 'X' button for uploaded images, not the placeholder
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
          <label className="w-20 h-20 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 cursor-pointer bg-gray-100">
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <Camera className="h-8 w-8 text-gray-500" />
          </label>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-500">
          <MapPin className="h-4 w-4" />
          <span>{t('releasePage.location')}: Istanbul</span>
        </div>

        {/* Advantage Info Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-[#101729] font-poppins">{t('releasePage.advantageInfo')}</h2>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={brandInfoChecked}
                onChange={(e) => setBrandInfoChecked(e.target.checked)}
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
                  required={brandInfoChecked}
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
                  required={brandInfoChecked}
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
        {successMessage && (
          <div className="flex items-center gap-2 text-green-500 text-sm">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Allowing Comments Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={allowingComments}
            onChange={(e) => setAllowingComments(e.target.checked)}
            className="form-checkbox h-4 w-4 rounded-sm border-gray-400 text-[#101729] focus:ring-[#101729]"
          />
          <span className="text-gray-700 text-sm">{t('releasePage.allowingComments')}</span>
        </div>

        {/* Release Button */}
        <Button
          type="submit"
          className="w-full bg-[#101729] text-white shadow-md rounded-lg"
          size="lg"
          disabled={isSubmitting || !!successMessage}
        >
          {isSubmitting 
            ? '发布中...' 
            : successMessage 
              ? '发布成功' 
              : t('releasePage.releaseButton')
          }
        </Button>
      </form>

      {/* Footer */}
      <Footer />
    </main>
  );
}

