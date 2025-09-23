"use client";

import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useLanguage } from "../../contexts/LanguageContext";
import { ChevronLeft, Play } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const HistoryItem = () => (
    <div className="mb-6">
      {/* Thumbnails */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="relative">
          <Image
            src="/img/band.png"
            alt="history-1"
            width={360}
            height={220}
            className="w-full h-28 object-cover rounded-md"
            priority
          />
          {/* play icon overlay */}
          <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-[#101729]/80 flex items-center justify-center">
            <Play className="h-3.5 w-3.5 text-white" />
          </div>
        </div>
        <Image
          src="/img/band.png"
          alt="history-2"
          width={360}
          height={220}
          className="w-full h-28 object-cover rounded-md"
        />
        <Image
          src="/img/band.png"
          alt="history-3"
          width={360}
          height={220}
          className="w-full h-28 object-cover rounded-md"
        />
      </div>

      {/* Title & description */}
      <h3 className="text-[18px] font-semibold text-[#101729] font-poppins mb-2">
        {t("square.titleContent")}
      </h3>
      <p className="text-[15px] leading-6 text-[#101729]/80 font-nunito">
        {t("square.description")}
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
          {t("personalCenter.menu.history")}
        </h1>
        <button
          aria-label="back"
          onClick={() => router.back()}
          className="text-[#101729] hover:text-[#101729]"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
      </div>

      {/* Content */}
      <section className="px-6 pb-6">
        <HistoryItem />
        <div className="border-t border-gray-200 my-4" />
        <HistoryItem />
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}