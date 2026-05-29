"use client";

import Image from "next/image";
import { type Template } from "@/data/templates";
import { type Language } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CardCanvasProps {
  template: Template;
  sender: string;
  recipient: string;
  message: string;
  language: Language;
}

export default function CardCanvas({
  template,
  sender,
  recipient,
  message,
  language,
}: CardCanvasProps) {
  const isSinhala = language === "si";

  // Sinhala uses Maname (display) for headings and Noto Serif Sinhala for body
  const headingFontClass = isSinhala ? "font-sinhala-display" : "font-display";
  const bodyFontClass = isSinhala ? "font-sinhala" : "font-display";

  // Default messages if fields are empty
  const displaySender = sender || (isSinhala ? "ඔබේ නම" : "Your Name");
  const displayRecipient = recipient || (isSinhala ? "ඔබට" : "Friend");
  const displayMessage =
    message ||
    (isSinhala
      ? "මෙම පූජනීය වෙසක් දිනයේ ත්‍රිවිධ රත්නයේ ආශීර්වාදය ඔබට සාමය, සතුට හා ප්‍රඥාව ගෙන එන්නේය."
      : "May the Triple Gem bless you with peace, happiness, and wisdom on this sacred Vesak day.");

  // Strong text shadow for legibility over any background
  const textShadow = "0 2px 8px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.5)";
  const accentTextShadow = "0 2px 6px rgba(0,0,0,0.7), 0 0 15px rgba(0,0,0,0.4)";

  return (
    <div className="relative w-full aspect-[4/3.6] sm:aspect-[1200/630]">
      <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl border border-border/50">
        {/* Background Image */}
        <Image
          src={template.bg_url}
          alt={template.name_en}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 60vw"
        />

        {/* Layered overlays for depth + text readability */}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />

        {/* Text content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-10 md:px-16 py-3 sm:py-10 text-center">

          {/* Frosted glass text backdrop */}
          <div className="relative bg-black/25 backdrop-blur-[6px] rounded-2xl px-4 sm:px-10 md:px-14 py-3 sm:py-8 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">

            {/* Vesak title — accent colored, bold */}
            <div className="mb-2 sm:mb-5">
              <p
                className={cn(
                  "text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.25em] mb-2",
                  headingFontClass
                )}
                style={{
                  color: template.accent_color,
                  textShadow: accentTextShadow,
                }}
              >
                {isSinhala ? "සුභ වෙසක් මංගල්‍යයක්" : "Happy Vesak"}
              </p>
              {/* Decorative line */}
              <div className="flex items-center justify-center gap-2">
                <div
                  className="w-8 sm:w-12 h-[1.5px]"
                  style={{ backgroundColor: template.accent_color, opacity: 0.7 }}
                />
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: template.accent_color, opacity: 0.9 }}
                />
                <div
                  className="w-8 sm:w-12 h-[1.5px]"
                  style={{ backgroundColor: template.accent_color, opacity: 0.7 }}
                />
              </div>
            </div>

            {/* Recipient — large, bold, clear */}
            <h2
              className={cn(
                "text-lg sm:text-3xl md:text-4xl font-extrabold mb-1 sm:mb-3 leading-tight",
                headingFontClass
              )}
              style={{
                color: template.text_color,
                textShadow: textShadow,
              }}
            >
              {isSinhala ? `ආදරණීය ${displayRecipient},` : `Dear ${displayRecipient},`}
            </h2>

            {/* Message — bold, good contrast */}
            <p
              className={cn(
                "text-[11px] sm:text-sm md:text-base leading-relaxed max-w-lg mb-2 sm:mb-6 font-semibold",
                bodyFontClass
              )}
              style={{
                color: template.text_color,
                textShadow: "0 1px 4px rgba(0,0,0,0.7), 0 0 10px rgba(0,0,0,0.4)",
              }}
            >
              {displayMessage}
            </p>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-2 mb-2 sm:mb-4">
              <div
                className="w-6 sm:w-8 h-px"
                style={{ backgroundColor: template.accent_color, opacity: 0.4 }}
              />
              <div
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: template.accent_color, opacity: 0.6 }}
              />
              <div
                className="w-6 sm:w-8 h-px"
                style={{ backgroundColor: template.accent_color, opacity: 0.4 }}
              />
            </div>

            {/* Sender — accented, bold */}
            <p
              className={cn(
                "text-sm sm:text-base md:text-lg font-bold",
                headingFontClass
              )}
              style={{
                color: template.accent_color,
                textShadow: accentTextShadow,
              }}
            >
              {isSinhala ? `— ${displaySender}` : `— With love, ${displaySender}`}
            </p>
          </div>
        </div>

        {/* Fuchsia Labs watermark */}
        <div className="absolute bottom-2 sm:bottom-3 right-3 sm:right-4 opacity-60 pointer-events-none select-none">
          <img
            src="/watermark.png"
            alt="වෙසක් ප්‍රභා by Fuchsia Labs"
            className="w-[90px] sm:w-[110px] md:w-[130px] h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}
