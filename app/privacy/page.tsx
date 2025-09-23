"use client";

import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { useLanguage } from "../../contexts/LanguageContext";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacyPage() {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <main className="flex min-h-dvh flex-col bg-white">
      {/* Header */}
      <Header showLanguage showSearch showUser />

      {/* Page title & back - 根据设计稿调整布局 */}
      <div className="flex items-center px-6 py-4">
        <button
          aria-label={t("privacy.back")}
          onClick={() => router.back()}
          className="text-[#101729] hover:text-[#101729] mr-4"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
        <h1 className="text-2xl font-semibold text-[#101729] font-poppins">
          {t("privacy.title")}
        </h1>
      </div>

      {/* Content - 根据设计稿调整样式 */}
      <section className="px-6 pb-6 flex-1">
        <div className="space-y-6">
          {/* Purpose Section */}
          <p className="text-[14px] leading-6 text-[#101729] font-nunito">
            {t("privacy.purpose")}
          </p>

          {/* Design/Methodology Section */}
          <p className="text-[14px] leading-6 text-[#101729] font-nunito">
            {t("privacy.design")}
          </p>

          {/* Findings Section */}
          <p className="text-[14px] leading-6 text-[#101729] font-nunito">
            {t("privacy.findings")}
          </p>

          {/* Trust and Loyalty Section */}
          <p className="text-[14px] leading-6 text-[#101729] font-nunito">
            {t("privacy.trust")}
          </p>

          {/* Security Section */}
          <p className="text-[14px] leading-6 text-[#101729] font-nunito">
            {t("privacy.security")}
          </p>

          {/* Data Collection Section */}
          <p className="text-[14px] leading-6 text-[#101729] font-nunito">
            {t("privacy.dataCollection")}
          </p>

          {/* Data Usage Section */}
          <p className="text-[14px] leading-6 text-[#101729] font-nunito">
            {t("privacy.dataUsage")}
          </p>

          {/* Contact Section */}
          <p className="text-[14px] leading-6 text-[#101729] font-nunito">
            {t("privacy.contact")}
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
