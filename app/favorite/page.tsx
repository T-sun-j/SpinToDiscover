"use client";

import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useLanguage } from "../../contexts/LanguageContext";
import { AuthGuard } from "../../components/AuthGuard";
import { ChevronLeft, Play, Heart, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useApi } from "../../lib/hooks/useApi";
import { getCollectList } from "../../lib/auth";
import { CollectItem, buildAvatarUrl } from "../../lib/api";
import { API_CONSTANTS } from "../../lib/constants";

export default function FavoritePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [collectData, setCollectData] = useState<CollectItem[]>([]);
  const hasLoaded = useRef(false);

  // 使用API Hook获取收藏列表数据
  const { data, loading, error, execute, userParams } = useApi(
    async (params) => {
      const response = await getCollectList({
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

  // 更新收藏数据
  useEffect(() => {
    if (data && data.success) {
      // 如果API返回成功，但data为空或dataList为空数组，则设置为空数组
      if (data.data?.dataList) {
        setCollectData(data.data.dataList);
      } else {
        setCollectData([]);
      }
    } else if (data && !data.success) {
      // 如果API返回失败（如"用户不存在"），也设置为空数组
      setCollectData([]);
    }
  }, [data]);

  const FavoriteItem = ({ item }: { item: CollectItem }) => (
    <div className="mb-6">
      {/* Thumbnails */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {item.images.slice(0, 3).map((image, index) => (
          <div key={index} className="relative">
            <Image
              src={buildAvatarUrl(image) || '/img/default-image.png'}
              alt={`${t("favoritePage.favoriteItem")} ${index + 1}`}
              width={112}
              height={112}
              className="w-full h-28 object-cover rounded-md"
              priority={index === 0}
            />
            {/* play icon overlay for first image if has video */}
            {index === 0 && item.video && (
              <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-[#101729]/80 flex items-center justify-center">
                <Play className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        ))}
        {/* Fill remaining slots if less than 3 images */}
        {item.images.length < 3 && Array.from({ length: 3 - item.images.length }).map((_, index) => (
          <div key={`placeholder-${index}`} className="w-full h-28 bg-gray-100 rounded-md flex items-center justify-center">
            <span className="text-gray-400 text-xs">{t("favoritePage.noImage")}</span>
          </div>
        ))}
      </div>

      {/* Title & description */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-[18px] text-[#101729] font-poppins flex-1">
          {item.title}
        </h3>
        <button
          aria-label={t("favoritePage.removeFromFavorites")}
          className="ml-2 p-1 text-red-500 hover:text-red-600 transition-colors"
        >
          <Heart className="h-5 w-5 fill-current" />
        </button>
      </div>
      <p className="text-sm leading-6 text-[#101729]/80 font-nunito mb-2">
        {item.description}
      </p>
      <div className="flex justify-between text-xs text-[#101729]/60">
        <span className="font-nunito">{item.author.nickname}</span>
        <span className="font-nunito">
          {t("favoritePage.collectedOn")} {new Date(item.collectedAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Heart className="h-16 w-16 text-gray-300 mb-4" />
      <h3 className="text-lg  text-[#101729] font-poppins mb-2">
        {t("favoritePage.emptyTitle")}
      </h3>
      <p className="text-[15px] text-[#101729]/60 font-nunito max-w-sm">
        {t("favoritePage.emptyDescription")}
      </p>
    </div>
  );

  return (
    <AuthGuard>
      <main className="flex min-h-dvh flex-col bg-white">
        {/* Header */}
        <Header showLanguage showSearch showUser />

      {/* Page title & back */}
      <div className="flex items-center justify-between px-6 py-2">
        <h1 className="text-2xl text-[#101729] font-poppins">
          {t("favoritePage.title")}
        </h1>
        <button
          aria-label={t("favoritePage.back")}
          onClick={() => router.back()}
          className="text-[#101729] hover:text-[#101729]"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
      </div>

      {/* Content */}
      <section className="px-6 pb-6 flex-1">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-[#101729]" />
            <span className="ml-2 text-[#101729] font-nunito">{t("favoritePage.loading")}</span>
          </div>
        )}

        {error && collectData.length > 0 && (
          <div className="flex items-center justify-center py-8">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="ml-2 text-red-500 font-nunito">{t("favoritePage.error")}</span>
          </div>
        )}

        {!loading && collectData.length === 0 && (
          <EmptyState />
        )}

        {!loading && !error && collectData.length > 0 && (
          <>
            {collectData.map((item, index) => (
              <div key={item.id}>
                <FavoriteItem item={item} />
                {index < collectData.length - 1 && (
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