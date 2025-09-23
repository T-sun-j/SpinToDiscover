"use client";

import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useLanguage } from "../../contexts/LanguageContext";
import { ChevronLeft, Play, Heart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function FavoritePage() {
  const { t } = useLanguage();
  const router = useRouter();

  // Mock data - in real app this would come from API/state
  const favoriteItems = [
    {
      id: 1,
      title: t("square.titleContent"),
      description: t("square.description"),
      images: ["/img/band.png", "/img/band.png", "/img/band.png"],
      hasVideo: true,
      publisher: t("square.publisher"),
    },
    {
      id: 2,
      title: t("square.titleContent"),
      description: t("square.description"),
      images: ["/img/band.png", "/img/band.png", "/img/band.png"],
      hasVideo: false,
      publisher: t("square.publisher"),
    },
  ];

  const FavoriteItem = ({ item }: { item: typeof favoriteItems[0] }) => (
    <div className="mb-6">
      {/* Thumbnails */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {item.images.map((image, index) => (
          <div key={index} className="relative">
            <Image
              src={image}
              alt={`${t("favoritePage.favoriteItem")} ${index + 1}`}
              width={360}
              height={220}
              className="w-full h-28 object-cover rounded-md"
              priority={index === 0}
            />
            {/* play icon overlay for first image if has video */}
            {index === 0 && item.hasVideo && (
              <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-[#101729]/80 flex items-center justify-center">
                <Play className="h-3.5 w-3.5 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Title & description */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-[18px] font-semibold text-[#101729] font-poppins flex-1">
          {item.title}
        </h3>
        <button
          aria-label={t("favoritePage.removeFromFavorites")}
          className="ml-2 p-1 text-red-500 hover:text-red-600 transition-colors"
        >
          <Heart className="h-5 w-5 fill-current" />
        </button>
      </div>
      <p className="text-[15px] leading-6 text-[#101729]/80 font-nunito mb-2">
        {item.description}
      </p>
      <p className="text-[14px] text-[#101729]/60 font-nunito">
        {t("favoritePage.publisher")}: {item.publisher}
      </p>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Heart className="h-16 w-16 text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-[#101729] font-poppins mb-2">
        {t("favoritePage.emptyTitle")}
      </h3>
      <p className="text-[15px] text-[#101729]/60 font-nunito max-w-sm">
        {t("favoritePage.emptyDescription")}
      </p>
    </div>
  );

  return (
    <main className="flex min-h-dvh flex-col bg-white">
      {/* Header */}
      <Header showLanguage showSearch showUser />

      {/* Page title & back */}
      <div className="flex items-center justify-between px-6 py-2">
        <h1 className="text-2xl font-semibold text-[#101729] font-poppins">
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
        {favoriteItems.length > 0 ? (
          <>
            {favoriteItems.map((item, index) => (
              <div key={item.id}>
                <FavoriteItem item={item} />
                {index < favoriteItems.length - 1 && (
                  <div className="border-t border-gray-200 my-4" />
                )}
              </div>
            ))}
          </>
        ) : (
          <EmptyState />
        )}
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}