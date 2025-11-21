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
      <Header showSearch showUser />

      {/* Page title & back */}
      <div className="flex items-center px-3 py-4 z-100">
        <button
          aria-label={t("protect.back") as string}
          onClick={() => router.back()}
          className="text-[#0F1728] hover:text-[#0F1728] mr-4"
        >
          <ChevronLeft className="h-7 w-7 z-10" />
        </button>
        <h1 className="text-xl text-[#0F1728] font-poppins font-semibold">
          {t("protect.title")}
        </h1>
      </div>

      {/* Content */}
      <section className="px-6 pb-6 flex-1">
        <div className="space-y-6">
          {/* Main Title */}
          <div className="text-center ">
            <h2 className="text-3xl font-semibold text-[#0F1728] font-poppins leading-tight text-left">
              {t("protect.mainTitle")}
            </h2>
          </div>

          {/* Project Image */}
          <div className="relative w-full">
            <Image
              src="/img/project.png"
              alt={(t("protect.projectImageAlt") as string) || "Project image"}
              width={600}
              height={400}
              className="w-full h-auto object-cover mx-auto"
            />  
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            {/* Introduction */}
            <div className="space-y-4">
              <p className="text-l  text-[#11295b] font-inter">
                {t("protect.introduction")}
              </p>
            </div>

            {/* Mission */}
            <div className="space-y-4">
              <p className="text-l text-[#11295b] font-inter">
                {t("protect.mission")}
              </p>
            </div>

            {/* Impact */}
            <div className="space-y-4">
              <p className="text-l text-[#11295b] font-inter">
                {t("protect.impact")}
              </p>
            </div>

            {/* Call to Action */}
            <div className="flex justify-end py-6">
              <button
                onClick={() => {
                  // Handle donation link
                  window.open('https://example.com/donate', '_blank');
                }}
                className="text-[#11295b] text-[16px] font-semibold font-inter underline hover:text-[#11295b] transition-colors flex items-center gap-2"
              >
                {t("protect.donateLink")}
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
