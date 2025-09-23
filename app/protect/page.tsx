"use client";

import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useLanguage } from "../../contexts/LanguageContext";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProtectPage() {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <main className="flex min-h-dvh flex-col bg-white">
      {/* Header */}
      <Header showLanguage showSearch showUser />

      {/* Page title & back */}
      <div className="flex items-center justify-between px-6 py-2">
        <h1 className="text-2xl font-semibold text-[#101729] font-poppins">
          {t("protect.title")}
        </h1>
        <button
          aria-label={t("protect.back")}
          onClick={() => router.back()}
          className="text-[#101729] hover:text-[#101729]"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
      </div>

      {/* Content */}
      <section className="px-6 pb-6 flex-1">
        <div className="space-y-6">
          {/* Main Title */}
          <div className="text-center py-4">
            <h2 className="text-[24px] font-bold text-[#101729] font-poppins leading-tight">
              {t("protect.mainTitle")}
            </h2>
          </div>

          {/* Images Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Left Image */}
              <div className="relative">
                <Image
                  src="/img/craft-hands.jpg"
                  alt={t("protect.craftImageAlt")}
                  width={200}
                  height={150}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
              
              {/* Right Image */}
              <div className="relative">
                <Image
                  src="/img/artisan-woman.jpg"
                  alt={t("protect.artisanImageAlt")}
                  width={200}
                  height={150}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            {/* Introduction */}
            <div className="space-y-4">
              <p className="text-[15px] leading-6 text-[#101729] font-nunito">
                {t("protect.introduction")}
              </p>
            </div>

            {/* Mission */}
            <div className="space-y-4">
              <p className="text-[15px] leading-6 text-[#101729] font-nunito">
                {t("protect.mission")}
              </p>
            </div>

            {/* Impact */}
            <div className="space-y-4">
              <p className="text-[15px] leading-6 text-[#101729] font-nunito">
                {t("protect.impact")}
              </p>
            </div>

            {/* Call to Action */}
            <div className="text-center py-6">
              <button
                onClick={() => {
                  // Handle donation link
                  window.open('https://example.com/donate', '_blank');
                }}
                className="text-[#1e3a8a] text-[16px] font-semibold font-poppins underline hover:text-[#1e40af] transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                {t("protect.donateLink")}
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <h3 className="text-[16px] font-semibold text-[#101729] font-poppins mb-2">
                {t("protect.transparencyTitle")}
              </h3>
              <p className="text-[14px] leading-5 text-[#101729]/80 font-nunito">
                {t("protect.transparency")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
