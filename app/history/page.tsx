"use client";

import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useLanguage } from "../../contexts/LanguageContext";
import { AuthGuard } from "../../components/AuthGuard";
import { useAuth } from "../../contexts/AuthContext";
import { ChevronLeft, Play, Loader2, AlertCircle, History } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useApi } from "../../lib/hooks/useApi";
import { getBrowsingList } from "../../lib/auth";
import { BrowsingHistoryItem, buildAvatarUrl } from "../../lib/api";
import { API_CONSTANTS } from "../../lib/constants";

export default function HistoryPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { authInfo } = useAuth();
  const [historyData, setHistoryData] = useState<BrowsingHistoryItem[]>([]);
  const hasLoaded = useRef(false);

  // 使用API Hook获取浏览历史数据
  const { data, loading, error, execute, userParams } = useApi(
    async (params) => {
      const response = await getBrowsingList({
        userId: params.userId,
        token: params.token,
        page: API_CONSTANTS.DEFAULT_PAGE,
        limit: API_CONSTANTS.DEFAULT_LIMIT,
      });
      return response;
    },
    null
  );

  // 组件挂载时获取数据
  useEffect(() => {
    if (userParams && userParams.userId && userParams.token && !hasLoaded.current) {
      hasLoaded.current = true;
      execute();
    }
  }, [userParams?.userId, userParams?.token, execute]);

  // 更新历史数据
  useEffect(() => {
    if (data && data.success) {
      // 如果API返回成功，但data为空或history为空数组，则设置为空数组
      if (data?.data) {
        setHistoryData(data?.data as BrowsingHistoryItem[]);
      } else {
        setHistoryData([]);
      }
    } else if (data && !data.success) {
      // 如果API返回失败（如"用户不存在"），也设置为空数组
      setHistoryData([]);
    }
  }, [data]);

  // 处理点击跳转到详情页面
  const handleItemClick = (itemId: string) => {
    // 如果有认证信息，传递到详情页面
    if (authInfo?.userId && authInfo?.token) {
      router.push(`/square/${itemId}?userId=${authInfo.userId}&token=${authInfo.token}`);
    } else {
      router.push(`/square/${itemId}`);
    }
  };

  const HistoryItem = ({ item }: { item: BrowsingHistoryItem }) => (
    <div 
      className="mb-6 cursor-pointer hover:opacity-80 transition-opacity"
      onClick={() => handleItemClick(item.id)}
    >
      {/* Thumbnails */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {item.images.slice(0, 3).map((image, index) => (
          <div key={index} className="relative">
            <Image
              src={buildAvatarUrl(image) || '/img/default-image.png'}
              alt={`history-${index + 1}`}
              width={112}
              height={112}
              className="w-full h-28 object-cover rounded-md"
              priority={index === 0}
            />
            {/* play icon overlay for first image if video exists */}
            {index === 0 && item.video && (
              <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-[#11295b]/80 flex items-center justify-center">
                <Play className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        ))}
        {/* Fill remaining slots if less than 3 images */}
        {/* {item.images.length < 3 && Array.from({ length: 3 - item.images.length }).map((_, index) => (
          <div key={`placeholder-${index}`} className="w-full h-28 bg-gray-100 rounded-md flex items-center justify-center">
            <span className="text-gray-400 text-xs">{t("history.noImage")}</span>
          </div>
        ))} */}
      </div>

      {/* Title & description */}
      <h3 className="text-[18px] font-semibold text-[#11295b] font-poppins mb-2">
        {item.title}
      </h3>
      <p className="text-sm leading-6 text-[#11295b]/80 font-nunito mb-2">
        {item.description}
      </p>
      
      {/* Location and viewed time */}
      <div className="flex justify-between text-xs text-[#11295b]/60">
        <span className="font-nunito">{item.location}</span>
        <span className="font-nunito">
          {t("history.viewedOn")} {new Date(item.updatedAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );

  return (
    <AuthGuard>
      <main className="flex min-h-dvh flex-col bg-white">
      {/* Header */}
      <Header showSearch showUser />

      {/* Page title & back */}
      <div className="flex justify-between items-center px-6 py-2">
        <h1 className="text-xl font-poppins text-[#11295b]">
          {t("personalCenter.menu.history")}
        </h1>
        <button
          aria-label={t("history.back")}
          onClick={() => router.back()}
          className="text-[#11295b] hover:text-[#11295b]"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
      </div>

      {/* Content */}
      <section className="px-6 pb-6">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-[#11295b]" />
            <span className="ml-2 text-[#11295b] font-nunito">{t("history.loading")}</span>
          </div>
        )}

        {error && historyData.length > 0 && (
          <div className="flex items-center justify-center py-8">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="ml-2 text-red-500 font-nunito">{t("history.error")}</span>
          </div>
        )}

        {!loading && historyData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <History className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#11295b] font-nunito mb-2">
              {t("history.noHistory")}
            </h3>
            <p className="text-[#11295b]/60 font-inter text-center">
              {t("history.noHistoryDescription")}
            </p>
          </div>
        )}

        {!loading && !error && historyData.length > 0 && (
          <>
            {historyData.map((item, index) => (
              <div key={item.id}>
                <HistoryItem item={item} />
                {index < historyData.length - 1 && (
                  <div className="border-t border-gray-200 my-4" />
                )}
              </div>
            ))}
          </>
        )}
      </section>

        {/* Footer */}
        <Footer />
      </main>
    </AuthGuard>
  );
}