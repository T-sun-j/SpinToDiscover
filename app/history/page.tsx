"use client";

import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useLanguage } from "../../contexts/LanguageContext";
import { ChevronLeft, Play, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useApi } from "../../lib/hooks/useApi";
import { getBrowsingList } from "../../lib/services";
import { BrowsingHistoryItem } from "../../lib/api";
import { API_CONSTANTS, UI_CONSTANTS, HISTORY_CONSTANTS, ANIMATION_CONSTANTS } from "../../lib/constants";
import { classNames } from "../../lib/utils/classNames";

export default function HistoryPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [historyData, setHistoryData] = useState<BrowsingHistoryItem[]>([]);

  // 使用API Hook获取浏览历史数据
  const { data, loading, error, execute, userParams } = useApi(
    async (params) => {
      const response = await getBrowsingList({
        userId: params.userId,
        token: params.token,
        page: API_CONSTANTS.DEFAULT_PAGE,
        limit: API_CONSTANTS.DEFAULT_LIMIT,
      });
      return response.data;
    },
    { 
      history: [], 
      pagination: { 
        currentPage: API_CONSTANTS.DEFAULT_PAGE, 
        totalPages: 1, 
        totalItems: 0, 
        hasNext: false, 
        hasPrev: false 
      } 
    }
  );

  // 组件挂载时获取数据
  useEffect(() => {
    if (userParams) {
      execute();
    }
  }, [execute, userParams]);

  // 更新历史数据
  useEffect(() => {
    if (data?.history) {
      setHistoryData(data.history);
    }
  }, [data]);

  const HistoryItem = ({ item }: { item: BrowsingHistoryItem }) => (
    <div className={UI_CONSTANTS.SPACING.MB_6}>
      {/* Thumbnails */}
      <div className={classNames(
        'grid',
        HISTORY_CONSTANTS.LAYOUT.GRID_COLS_3,
        UI_CONSTANTS.SPACING.GAP_4,
        UI_CONSTANTS.SPACING.MB_4
      )}>
        {item.images.slice(0, HISTORY_CONSTANTS.IMAGES.MAX_THUMBNAILS).map((image, index) => (
          <div key={index} className="relative">
            <Image
              src={image || HISTORY_CONSTANTS.IMAGES.DEFAULT_IMAGE}
              alt={`history-${index + 1}`}
              width={HISTORY_CONSTANTS.IMAGES.THUMBNAIL_SIZE.width}
              height={HISTORY_CONSTANTS.IMAGES.THUMBNAIL_SIZE.height}
              className={HISTORY_CONSTANTS.IMAGES.THUMBNAIL_CLASS}
              priority={index === 0}
            />
            {/* play icon overlay for first image if video exists */}
            {index === 0 && item.video && (
              <div className={classNames(
                'absolute bottom-2 right-2',
                UI_CONSTANTS.SIZES.ICON_MD,
                UI_CONSTANTS.BORDER_RADIUS.ROUNDED_FULL,
                'bg-[#101729]/80',
                HISTORY_CONSTANTS.LAYOUT.FLEX_CENTER
              )}>
                <Play className={classNames(
                  UI_CONSTANTS.SIZES.ICON_SM,
                  UI_CONSTANTS.COLORS.WHITE
                )} />
              </div>
            )}
          </div>
        ))}
        {/* Fill remaining slots if less than 3 images */}
        {item.images.length < HISTORY_CONSTANTS.IMAGES.MAX_THUMBNAILS && Array.from({ length: HISTORY_CONSTANTS.IMAGES.MAX_THUMBNAILS - item.images.length }).map((_, index) => (
          <div key={`placeholder-${index}`} className={classNames(
            'w-full h-28',
            UI_CONSTANTS.COLORS.GRAY_100,
            UI_CONSTANTS.BORDER_RADIUS.ROUNDED_MD,
            HISTORY_CONSTANTS.LAYOUT.FLEX_CENTER
          )}>
            <span className={classNames(
              UI_CONSTANTS.COLORS.GRAY_400,
              HISTORY_CONSTANTS.TEXT_SIZES.XS
            )}>{t("history.noImage")}</span>
          </div>
        ))}
      </div>

      {/* Title & description */}
      <h3 className={classNames(
        'text-[18px]',
        UI_CONSTANTS.FONT_WEIGHTS.SEMIBOLD,
        UI_CONSTANTS.COLORS.PRIMARY,
        UI_CONSTANTS.FONTS.POPPINS,
        UI_CONSTANTS.SPACING.MB_2
      )}>
        {item.title}
      </h3>
      <p className={classNames(
        HISTORY_CONSTANTS.TEXT_SIZES.BODY,
        'leading-6',
        UI_CONSTANTS.COLORS.PRIMARY_OPACITY_80,
        UI_CONSTANTS.FONTS.NUNITO,
        UI_CONSTANTS.SPACING.MB_2
      )}>
        {item.description}
      </p>
      
      {/* Location and viewed time */}
      <div className={classNames(
        HISTORY_CONSTANTS.LAYOUT.FLEX_BETWEEN,
        HISTORY_CONSTANTS.TEXT_SIZES.SMALL,
        UI_CONSTANTS.COLORS.PRIMARY_OPACITY_60
      )}>
        <span className={UI_CONSTANTS.FONTS.NUNITO}>{item.location}</span>
        <span className={UI_CONSTANTS.FONTS.NUNITO}>
          {t("history.viewedOn")} {new Date(item.viewedAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );

  return (
    <main className={classNames(
      'flex',
      HISTORY_CONSTANTS.LAYOUT.MIN_HEIGHT_DVH,
      HISTORY_CONSTANTS.LAYOUT.FLEX_COL,
      'bg-white'
    )}>
      {/* Header */}
      <Header showLanguage showSearch showUser />

      {/* Page title & back */}
      <div className={classNames(
        HISTORY_CONSTANTS.LAYOUT.FLEX_BETWEEN,
        UI_CONSTANTS.SPACING.PX_6,
        UI_CONSTANTS.SPACING.PY_2
      )}>
        <h1 className={classNames(
          HISTORY_CONSTANTS.TEXT_SIZES.TITLE,
          UI_CONSTANTS.FONT_WEIGHTS.SEMIBOLD,
          UI_CONSTANTS.COLORS.PRIMARY,
          UI_CONSTANTS.FONTS.POPPINS
        )}>
          {t("personalCenter.menu.history")}
        </h1>
        <div className={classNames(
          HISTORY_CONSTANTS.LAYOUT.FLEX_CENTER,
          UI_CONSTANTS.SPACING.GAP_2
        )}>
          <button
            aria-label={t("history.refresh")}
            onClick={() => execute()}
            disabled={loading}
            className={classNames(
              UI_CONSTANTS.COLORS.PRIMARY,
              'hover:text-[#101729]/80',
              'disabled:opacity-50'
            )}
          >
            <RefreshCw className={classNames(
              UI_CONSTANTS.SIZES.ICON_MD,
              loading && ANIMATION_CONSTANTS.SPIN
            )} />
          </button>
          <button
            aria-label={t("history.back")}
            onClick={() => router.back()}
            className={classNames(
              UI_CONSTANTS.COLORS.PRIMARY,
              'hover:text-[#101729]'
            )}
          >
            <ChevronLeft className={UI_CONSTANTS.SIZES.ICON_LG} />
          </button>
        </div>
      </div>

      {/* Content */}
      <section className={classNames(
        UI_CONSTANTS.SPACING.PX_6,
        UI_CONSTANTS.SPACING.PB_6
      )}>
        {loading && (
          <div className={classNames(
            HISTORY_CONSTANTS.LAYOUT.FLEX_CENTER,
            UI_CONSTANTS.SPACING.PY_8
          )}>
            <Loader2 className={classNames(
              UI_CONSTANTS.SIZES.ICON_MD,
              ANIMATION_CONSTANTS.SPIN,
              UI_CONSTANTS.COLORS.PRIMARY
            )} />
            <span className={classNames(
              'ml-2',
              UI_CONSTANTS.COLORS.PRIMARY,
              UI_CONSTANTS.FONTS.NUNITO
            )}>{t("history.loading")}</span>
          </div>
        )}

        {error && (
          <div className={classNames(
            HISTORY_CONSTANTS.LAYOUT.FLEX_CENTER,
            UI_CONSTANTS.SPACING.PY_8
          )}>
            <AlertCircle className={classNames(
              UI_CONSTANTS.SIZES.ICON_MD,
              UI_CONSTANTS.COLORS.RED_500
            )} />
            <span className={classNames(
              'ml-2',
              UI_CONSTANTS.COLORS.RED_500,
              UI_CONSTANTS.FONTS.NUNITO
            )}>{t("history.error")}</span>
          </div>
        )}

        {!loading && !error && historyData.length === 0 && (
          <div className={classNames(
            'flex flex-col items-center justify-center',
            UI_CONSTANTS.SPACING.PY_12
          )}>
            <div className={classNames(
              'w-16 h-16',
              UI_CONSTANTS.COLORS.GRAY_100,
              UI_CONSTANTS.BORDER_RADIUS.ROUNDED_FULL,
              HISTORY_CONSTANTS.LAYOUT.FLEX_CENTER,
              UI_CONSTANTS.SPACING.MB_4
            )}>
              <AlertCircle className={classNames(
                UI_CONSTANTS.SIZES.ICON_XL,
                UI_CONSTANTS.COLORS.GRAY_400
              )} />
            </div>
            <h3 className={classNames(
              HISTORY_CONSTANTS.TEXT_SIZES.SUBTITLE,
              UI_CONSTANTS.FONT_WEIGHTS.SEMIBOLD,
              UI_CONSTANTS.COLORS.PRIMARY,
              UI_CONSTANTS.FONTS.NUNITO,
              UI_CONSTANTS.SPACING.MB_2
            )}>
              {t("history.noHistory")}
            </h3>
            <p className={classNames(
              UI_CONSTANTS.COLORS.PRIMARY_OPACITY_60,
              UI_CONSTANTS.FONTS.INTER,
              'text-center'
            )}>
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
                  <div className={classNames(
                    'border-t border-gray-200',
                    UI_CONSTANTS.SPACING.MY_4
                  )} />
                )}
              </div>
            ))}
          </>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}