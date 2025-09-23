"use client";

import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useLanguage } from "../../contexts/LanguageContext";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <main className="flex min-h-dvh flex-col bg-white">
      {/* Header */}
      <Header showLanguage showSearch showUser />

      {/* Page title & back - 根据设计稿调整布局 */}
      <div className="flex items-center px-6 py-4">
        <button
          aria-label={t("about.back")}
          onClick={() => router.back()}
          className="text-[#101729] hover:text-[#101729] mr-4"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
        <h1 className="text-2xl font-semibold text-[#101729] font-poppins">
          {t("about.title")}
        </h1>
      </div>

      {/* Content  */}
      <section className="px-6 pb-6 flex-1">
        <div className="flex justify-end mb-6">
          <img
            src="/img/logo-2.png"
            alt="Logo"
            className="h-14 w-auto"
            style={{ objectFit: "contain" }}
          />
        </div>
        <div className="space-y-6">
          {/* Introduction */}
          <p className="text-[15px] leading-6 text-[#101729] font-nunito">
            {t("about.introduction")}
          </p>
          
          <p className="text-[15px] leading-6 text-[#101729] font-nunito">
            {t("about.belief")}
          </p>

          {/* Mission */}
          <p className="text-[15px] leading-6 text-[#101729] font-nunito">
            {t("about.mission")}
          </p>

          {/* Values */}
          <p className="text-[15px] leading-6 text-[#101729] font-nunito">
            {t("about.values")}
          </p>

          {/* Experience */}
          <p className="text-[15px] leading-6 text-[#101729] font-nunito">
            {t("about.experience")}
          </p>

          {/* Motto */}
          <p className="text-[15px] leading-6 text-[#101729] font-nunito ">
            {t("about.motto")}
          </p>

          {/* Spin to Protect Section */}
          <div className="bg-[#101729] rounded-lg p-6 mt-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-white text-xl font-semibold font-poppins mb-2">
                  {t("about.protectTitle")}
                </h3>
                <p className="text-white/90 text-[10px] font-nunito">
                  {t("about.protectDescription")}
                </p>
              </div>
              <div className="ml-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-[#101729] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
