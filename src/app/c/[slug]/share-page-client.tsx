"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Copy,
  Download,
  MessageCircle,
  Check,
  Sparkles,
  ArrowRight,
  Loader2,
  ImageIcon,
  Eye,
} from "lucide-react";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CardCanvas from "@/components/card-builder/card-canvas";
import { getTemplate, templates } from "@/data/templates";
import { supabase } from "@/lib/supabase";
import { downloadCard } from "@/lib/download-card";
import { type Language } from "@/lib/types";

interface SharePageClientProps {
  slug: string;
  search: {
    t?: string;
    lang?: string;
    s?: string;
    r?: string;
    m?: string;
  };
}

export default function SharePageClient({ slug, search }: SharePageClientProps) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [showTemplateOnly, setShowTemplateOnly] = useState(false);
  const [dbCard, setDbCard] = useState<{
    template_id: number;
    language: string;
    sender: string;
    recipient: string;
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Determine if URL search params are present (instant rendering)
  const hasUrlParams = search.t !== undefined && search.s !== undefined && search.r !== undefined;

  // Active card data
  const templateId = parseInt(hasUrlParams ? (search.t || "1") : (dbCard?.template_id?.toString() || "1"));
  const language = (hasUrlParams ? (search.lang || "en") : (dbCard?.language || "en")) as Language;
  const sender = hasUrlParams ? (search.s || "") : (dbCard?.sender || "");
  const recipient = hasUrlParams ? (search.r || "") : (dbCard?.recipient || "");
  const message = hasUrlParams ? (search.m || "") : (dbCard?.message || "");

  const template = getTemplate(templateId) || templates[0];
  
  // Calculate full sharing URL including dynamic parameters
  const cardUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/c/${slug}${window.location.search}` 
    : "";

  useEffect(() => {
    if (hasUrlParams) return;

    const fetchCard = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("cards")
          .select("*")
          .eq("slug", slug)
          .single();

        if (data && !error) {
          setDbCard(data);
        }
      } catch (err) {
        console.error("Failed to fetch card from database:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCard();
  }, [slug, hasUrlParams]);

  useEffect(() => {
    if (!cardUrl) return;
    setShortenedUrl(cardUrl);
    
    const shorten = async () => {
      try {
        const res = await fetch("/api/shorten", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: cardUrl }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.shortUrl) {
            setShortenedUrl(data.shortUrl);
          }
        }
      } catch (e) {
        console.error("Failed to fetch shortened URL", e);
      }
    };
    shorten();
  }, [cardUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    const isSinhala = language === "si";
    const text = isSinhala
      ? `ආදරණීය ${recipient},\n${message}\n — ${sender} වෙතින්\n\nඔබේ වෙසක් පත මෙතැනින් බලන්න: ${shortenedUrl}`
      : `Dear ${recipient},\n${message}\n From ${sender}\n\nView your Vesak Card at ${shortenedUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shortenedUrl)}`,
      "_blank"
    );
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadCard(template, sender, recipient, message, language);
    } catch (error) {
      console.error("Error generating card download:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-40 pb-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-accent-pink mx-auto mb-4" />
            <p className="text-text-muted">Loading your Vesak blessing...</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Card Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="relative w-full overflow-hidden">
              {showTemplateOnly ? (
                <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-border/50 aspect-[4/3.6] sm:aspect-[1200/630]">
                  <img
                    src={template.bg_url}
                    alt={template.name_en}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <CardCanvas
                  template={template}
                  sender={sender}
                  recipient={recipient}
                  message={message}
                  language={language}
                />
              )}
            </div>
            {/* Toggle template-only view */}
            <div className="flex justify-end mt-2">
              <button
                onClick={() => setShowTemplateOnly(!showTemplateOnly)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:text-text-primary bg-bg-card/50 border border-border/50 hover:border-accent-gold/40 transition-all"
              >
                {showTemplateOnly ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    View Card
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-3.5 h-3.5" />
                    View Template
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            className="card-surface p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-text-primary font-display mb-1">
                A Vesak Blessing For You 🪷
              </h2>
              <p className="text-sm text-text-muted">
                Share this card or create your own
              </p>
            </div>

            {/* Share buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <button
                onClick={handleCopy}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-bg-primary border border-border hover:border-accent-pink/50 transition-all group"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <Copy className="w-5 h-5 text-text-muted group-hover:text-accent-pink transition-colors" />
                )}
                <span className="text-xs text-text-muted">
                  {copied ? "Copied!" : "Copy Link"}
                </span>
              </button>

              <button
                onClick={handleWhatsApp}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-bg-primary border border-border hover:border-green-500/50 transition-all group"
              >
                <MessageCircle className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-text-muted">WhatsApp</span>
              </button>

              <button
                onClick={handleFacebook}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-bg-primary border border-border hover:border-blue-500/50 transition-all group"
              >
                <FacebookIcon className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-text-muted">Facebook</span>
              </button>

              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-bg-primary border border-border hover:border-accent-gold/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <Loader2 className="w-5 h-5 text-accent-gold animate-spin" />
                ) : (
                  <Download className="w-5 h-5 text-accent-gold group-hover:scale-110 transition-transform" />
                )}
                <span className="text-xs text-text-muted">
                  {isDownloading ? "Preparing..." : "Download"}
                </span>
              </button>
            </div>

            {/* Create your own CTA */}
            <div className="text-center">
              <Link href="/create" className="btn-primary group">
                <Sparkles className="w-4 h-4 mr-2" />
                Create Your Own Card
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Branding */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs text-text-muted/50">
              Created with{" "}
              <Link href="/" className="text-accent-pink/50 hover:text-accent-pink font-sinhala-display px-0.5">
                වෙසක් ප්‍රභා
              </Link>{" "}
              by Fuchsia Labs
            </p>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
