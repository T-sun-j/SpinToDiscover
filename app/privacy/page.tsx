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
      <Header showSearch showUser />

      {/* Page title & back - 根据设计稿调整布局 */}
      <div className="flex items-center px-6 py-4 z-100">
        <button
          aria-label={t("privacy.back") as string}
          onClick={() => router.back()}
          className="text-[#0F1728] hover:text-[#0F1728] mr-4"
        >
          <ChevronLeft className="h-7 w-7 z-10" />
        </button>
        <h1 className="text-2xl font-semibold text-[#0F1728] font-poppins">
          {t("privacy.title")}
        </h1>
      </div>

      {/* Content - 根据设计稿调整样式 */}
      <section className="px-6 pb-6 flex-1 overflow-y-auto">
        <div className="space-y-6">
          {/* Last Updated */}
          <p className="text-[12px] text-[#11295b] font-nunito">
            {t("privacy.lastUpdated")}
          </p>

          {/* Introduction */}
          <p className="text-[14px] leading-6 text-[#11295b] font-nunito">
            {t("privacy.introduction")}
          </p>

          {/* Section 1: Information We Collect */}
          <div className="space-y-3">
            <h2 className="text-[16px] font-semibold text-[#0F1728] font-poppins">
              {t("privacy.section1Title")}
            </h2>
            
            <div className="space-y-2">
              <h3 className="text-[14px] font-medium text-[#0F1728] font-poppins">
                {t("privacy.section1Subtitle1")}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-[14px] leading-6 text-[#11295b] font-nunito ml-2">
                {(t("privacy.section1Subtitle1Items") as string[]).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-[14px] font-medium text-[#0F1728] font-poppins">
                {t("privacy.section1Subtitle2")}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-[14px] leading-6 text-[#11295b] font-nunito ml-2">
                {(t("privacy.section1Subtitle2Items") as string[]).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-[14px] font-medium text-[#0F1728] font-poppins">
                {t("privacy.section1Subtitle3")}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-[14px] leading-6 text-[#11295b] font-nunito ml-2">
                {(t("privacy.section1Subtitle3Items") as string[]).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 2: How We Use Your Information */}
          <div className="space-y-3">
            <h2 className="text-[16px] font-semibold text-[#0F1728] font-poppins">
              {t("privacy.section2Title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-[14px] leading-6 text-[#11295b] font-nunito ml-2">
              {(t("privacy.section2Items") as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="text-[14px] leading-6 text-[#11295b] font-nunito font-semibold">
              {t("privacy.section2Note")}
            </p>
          </div>

          {/* Section 3: Information Sharing */}
          <div className="space-y-3">
            <h2 className="text-[16px] font-semibold text-[#0F1728] font-poppins">
              {t("privacy.section3Title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-[14px] leading-6 text-[#11295b] font-nunito ml-2">
              {(t("privacy.section3Items") as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="text-[14px] leading-6 text-[#11295b] font-nunito">
              {t("privacy.section3Note")}
            </p>
          </div>

          {/* Section 4: Data Storage & Security */}
          <div className="space-y-3">
            <h2 className="text-[16px] font-semibold text-[#0F1728] font-poppins">
              {t("privacy.section4Title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-[14px] leading-6 text-[#11295b] font-nunito ml-2">
              {(t("privacy.section4Items") as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Section 5: Your Rights */}
          <div className="space-y-3">
            <h2 className="text-[16px] font-semibold text-[#0F1728] font-poppins">
              {t("privacy.section5Title")}
            </h2>
            <ul className="list-disc list-inside space-y-1 text-[14px] leading-6 text-[#11295b] font-nunito ml-2">
              {(t("privacy.section5Items") as string[]).map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Section 6: Protection of Minors */}
          <div className="space-y-3">
            <h2 className="text-[16px] font-semibold text-[#0F1728] font-poppins">
              {t("privacy.section6Title")}
            </h2>
            <p className="text-[14px] leading-6 text-[#11295b] font-nunito">
              {t("privacy.section6Content")}
            </p>
          </div>

          {/* Section 7: Policy Updates */}
          <div className="space-y-3">
            <h2 className="text-[16px] font-semibold text-[#0F1728] font-poppins">
              {t("privacy.section7Title")}
            </h2>
            <p className="text-[14px] leading-6 text-[#11295b] font-nunito">
              {t("privacy.section7Content")}
            </p>
          </div>

          {/* Media License Agreement */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h2 className="text-[16px] font-semibold text-[#0F1728] font-poppins">
              {t("privacy.mediaLicenseTitle")}
            </h2>
            <p className="text-[14px] leading-6 text-[#11295b] font-nunito">
              {t("privacy.mediaLicenseIntro")}
            </p>

            {/* License Grant */}
            <div className="space-y-3">
              <h3 className="text-[14px] font-medium text-[#0F1728] font-poppins">
                {t("privacy.mediaLicenseSection1Title")}
              </h3>
              <p className="text-[14px] leading-6 text-[#11295b] font-nunito">
                {t("privacy.mediaLicenseSection1Content")}
              </p>
              <ul className="list-disc list-inside space-y-1 text-[14px] leading-6 text-[#11295b] font-nunito ml-2">
                {(t("privacy.mediaLicenseSection1Items") as string[]).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <p className="text-[14px] leading-6 text-[#11295b] font-nunito">
                {t("privacy.mediaLicenseSection1Note")}
              </p>
            </div>

            {/* Ownership */}
            <div className="space-y-3">
              <h3 className="text-[14px] font-medium text-[#0F1728] font-poppins">
                {t("privacy.mediaLicenseSection2Title")}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-[14px] leading-6 text-[#11295b] font-nunito ml-2">
                {(t("privacy.mediaLicenseSection2Items") as string[]).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Duration */}
            <div className="space-y-3">
              <h3 className="text-[14px] font-medium text-[#0F1728] font-poppins">
                {t("privacy.mediaLicenseSection3Title")}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-[14px] leading-6 text-[#11295b] font-nunito ml-2">
                {(t("privacy.mediaLicenseSection3Items") as string[]).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Revocation */}
            <div className="space-y-3">
              <h3 className="text-[14px] font-medium text-[#0F1728] font-poppins">
                {t("privacy.mediaLicenseSection4Title")}
              </h3>
              <p className="text-[14px] leading-6 text-[#11295b] font-nunito">
                {t("privacy.mediaLicenseSection4Content")}
              </p>
            </div>

            {/* Platform Commitments */}
            <div className="space-y-3">
              <h3 className="text-[14px] font-medium text-[#0F1728] font-poppins">
                {t("privacy.mediaLicenseSection5Title")}
              </h3>
              <p className="text-[14px] leading-6 text-[#11295b] font-nunito mb-2">
                SpinLinX {t("privacy.mediaLicenseSection5Title")}：
              </p>
              <ul className="list-disc list-inside space-y-1 text-[14px] leading-6 text-[#11295b] font-nunito ml-2">
                {(t("privacy.mediaLicenseSection5Items") as string[]).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
