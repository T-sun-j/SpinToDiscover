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
      <div className="flex items-center px-4 py-4">
        <button
          aria-label={t("about.back")}
          onClick={() => router.back()}
          className="text-[#11295b] hover:text-[#11295b] mr-4"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
        <h1 className="text-xl text-[#11295b] font-poppins">
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
          <p className="text-l leading-7 text-[#11295b] font-inter">
            {t("about.introduction")}
          </p>
          
          <p className="text-l leading-7 text-[#11295b] font-inter">
            {t("about.belief")}
          </p>

          {/* Mission */}
          <p className="text-l leading-7 text-[#11295b] font-inter">
            {t("about.mission")}
          </p>

          {/* Values */}
          <p className="text-l leading-7 text-[#11295b] font-inter">
            {t("about.values")}
          </p>

          {/* Experience */}
          <p className="text-l leading-7 text-[#11295b] font-inter">
            {t("about.experience")}
          </p>

          {/* Motto */}
          <p className="text-l leading-7 text-[#11295b] font-inter">
            {t("about.motto")}
          </p>

          {/* Spin to Protect Section */}
          <div className="bg-[#11295b] rounded-lg p-4 mt-8" onClick={() => router.push('/protect')}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-white text-2xl font-semibold font-poppins mb-2">
                  {t("about.protectTitle")}
                </h3>
                <p className="text-white/90 text-[11px] font-inter">
                  {t("about.protectDescription")}
                </p>
              </div>
              <div className="">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center cursor-pointer" onClick={() => router.push('/protect')}>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-[#11295b] rounded-full"></div>
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
