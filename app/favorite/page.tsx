"use client";

import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useLanguage } from "../../contexts/LanguageContext";
import { AuthGuard } from "../../components/AuthGuard";
import { useAuth } from "../../contexts/AuthContext";
import { ChevronLeft, Play, Heart, Loader2, Earth } from "lucide-react";
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
  const { authInfo } = useAuth();
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

  // 转换API返回的数据格式为CollectItem格式
  const transformCollectData = (apiData: any): CollectItem[] => {
    if (!apiData || !Array.isArray(apiData) || apiData.length === 0) {
      return [];
    }

    return apiData.map((item: any) => {
      // 从API响应中提取数据
      const id = item.proid || '';
      const product = item.product?.[0] || {};
      const title = product.title || '';
      
      // 从product中提取其他信息（如果API返回完整的产品信息）
      const description = product.description || '';
      const images = product.piclist || [];
      const video = product.video || '';
      const location = product.location || '';
      
      // 从用户信息中提取作者信息（如果API返回）
      const authorId = item.uid || '';
      const author = item.users?.[0] || {
        userId: authorId,
        nickname: '',
        avatar: ''
      };
      
      // 转换时间戳为日期字符串
      const collectedAt = item.createtime 
        ? new Date(item.createtime * 1000).toISOString()
        : new Date().toISOString();

      return {
        id,
        title,
        description,
        images,
        video,
        location,
        collectedAt,
        author: {
          userId: author.userId || authorId,
          nickname: author.nickname || '',
          avatar: author.avatar || ''
        }
      };
    });
  };

  // 更新收藏数据
  useEffect(() => {
    if (data) {
      // 如果data.success存在，说明是包装在ApiResponse中的格式
      if (data.success && data.data) {
        // 如果data.data是数组（新格式），直接转换
        if (Array.isArray(data.data)) {
          const transformed = transformCollectData(data.data);
          setCollectData(transformed);
        }
        // 如果data.data.dataList存在（旧格式），使用dataList
        else if (data.data.dataList && Array.isArray(data.data.dataList)) {
          setCollectData(data.data.dataList);
        }
        // 如果data.data是对象，尝试转换
        else {
          const transformed = transformCollectData([data.data]);
          setCollectData(transformed);
        }
      } 
      // 如果data是数组（直接返回数组格式），直接转换
      else if (Array.isArray(data)) {
        const transformed = transformCollectData(data);
        setCollectData(transformed);
      }
      // 如果data.dataList存在（兼容旧格式）
      else if ((data as any).dataList && Array.isArray((data as any).dataList)) {
        setCollectData((data as any).dataList);
      }
      // 其他情况，尝试转换
      else {
        const transformed = transformCollectData([data]);
        setCollectData(transformed);
      }
    } else {
      setCollectData([]);
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

  const FavoriteItem = ({ item }: { item: CollectItem }) => (
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
              alt={`${t("favoritePage.favoriteItem")} ${index + 1}`}
              width={112}
              height={112}
              className="w-full h-28 object-cover rounded-md"
              priority={index === 0}
            />
            {/* play icon overlay for first image if has video */}
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
            <span className="text-gray-400 text-xs">{t("favoritePage.noImage")}</span>
          </div>
        ))} */}
      </div>

      {/* Title & description */}
      <div className="flex items-start justify-between mb-2">
        <h3 className=" text-[#12295B] text-lg italic font-nunito font-semibold mb-1">
          {item.title}
        </h3>
        <button
          aria-label={t("favoritePage.removeFromFavorites") as string}
          onClick={(e) => {
            e.stopPropagation(); // 阻止事件冒泡，避免触发父元素的点击事件
            // TODO: 实现取消收藏功能
          }}
          className="ml-2 p-1 text-red-500 hover:text-red-600 transition-colors"
        >
          <Heart className="h-5 w-5 fill-current" />
        </button>
      </div>
      {/* <p className="text-sm leading-6 text-[#11295b]/80 font-nunito mb-2">
        {item.description}
      </p> */}
      <div className="flex justify-between text-xs text-[#11295b]/60">
        <span className="font-nunito">{item.author.nickname}</span>
        <span className="font-nunito">
          {t("favoritePage.collectedOn")} {new Date(item.collectedAt).toLocaleDateString()}
        </span>
      </div>
      <div className="" style={{marginTop: '10px', borderBottom: '1px solid #e5e7eb' }}></div>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Heart className="h-16 w-16 text-gray-300 mb-4" />
      <h3 className="text-lg  text-[#11295b] font-poppins mb-2">
        {t("favoritePage.emptyTitle")}
      </h3>
      <p className="text-[15px] text-[#11295b]/60 font-nunito max-w-sm">
        {t("favoritePage.emptyDescription")}
      </p>
    </div>
  );

  return (
    <AuthGuard>
      <main className="flex min-h-dvh flex-col bg-white">
        {/* Header */}
        <Header showSearch showUser />

      {/* Page title & back */}
      <div className="flex items-center justify-between px-4 py-4 z-100">
        <h1 className="text-xl font-poppins text-[#0F1728] font-semibold">
          {t("favoritePage.title")}
        </h1>
        <button
          aria-label={t("favoritePage.back") as string}
          onClick={() => router.back()}
          className="text-[#0F1728] hover:text-[#0F1728]"
        >
          <ChevronLeft className="h-7 w-7 z-10" />
        </button>
      </div>

      {/* Content */}
      <section className="px-4 pb-6 flex-1">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-[#11295b]" />
            <span className="ml-2 text-[#11295b] font-nunito">{t("favoritePage.loading")}</span>
          </div>
        )}

        {error && collectData.length > 0 && (
          <div className="flex items-center justify-center py-8">
            <Earth className="w-5 h-5 text-red-500" />
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
                {/* {index < collectData.length - 1 && (
                  <div className=" my-4" />
                )} */}
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