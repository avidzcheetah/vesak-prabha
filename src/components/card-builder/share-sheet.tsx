"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Download,
  MessageCircle,
  X,
  Check,
  Sparkles,
  Loader2,
} from "lucide-react";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
import { useState, useEffect } from "react";
import { type Template } from "@/data/templates";
import { type Language } from "@/lib/types";
import { downloadCard } from "@/lib/download-card";

interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cardUrl: string;
  imageUrl: string;
  sender: string;
  recipient: string;
  template: Template;
  message: string;
  language: Language;
}

export default function ShareSheet({
  isOpen,
  onClose,
  cardUrl,
  imageUrl,
  sender,
  recipient,
  template,
  message,
  language,
}: ShareSheetProps) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState(cardUrl);

  useEffect(() => {
    if (!isOpen || !cardUrl) return;
    
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
  }, [isOpen, cardUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = shortenedUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    const isSinhala = language === "si";
    const text = isSinhala
      ? `ආදරණීය ${recipient},\n${message}\n — ${sender} වෙතින්\n\nඔබේ වෙසක් පත මෙතැනින් බලන්න: ${shortenedUrl}`
      : `Dear ${recipient},\n${message}\n From ${sender}\n\nView your Vesak Card at ${shortenedUrl}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 glass-panel rounded-b-none border-b-0 p-6 md:max-w-lg md:mx-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:rounded-2xl md:border-b"
          >
            {/* Handle bar (mobile) */}
            <div className="flex justify-center mb-4 md:hidden">
              <div className="w-12 h-1 rounded-full bg-border" />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-card transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-fuchsia mb-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-text-primary font-display">
                Your Card is Ready!
              </h3>
              <p className="text-sm text-text-muted mt-1">
                Share the light with your loved ones
              </p>
            </div>

            {/* Card URL */}
            <div className="flex items-center gap-2 bg-bg-primary rounded-xl border border-border p-3 mb-6">
              <input
                type="text"
                readOnly
                value={shortenedUrl}
                className="flex-1 bg-transparent text-sm text-text-primary truncate outline-none"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-card border border-border text-xs font-medium text-text-primary hover:border-accent-pink transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Share buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handleWhatsApp}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-bg-primary border border-border hover:border-green-500/50 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all group"
              >
                <MessageCircle className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-text-muted group-hover:text-text-primary">
                  WhatsApp
                </span>
              </button>

              <button
                onClick={handleFacebook}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-bg-primary border border-border hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all group"
              >
                <FacebookIcon className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-text-muted group-hover:text-text-primary">
                  Facebook
                </span>
              </button>

              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-bg-primary border border-border hover:border-accent-gold/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <Loader2 className="w-6 h-6 text-accent-gold animate-spin" />
                ) : (
                  <Download className="w-6 h-6 text-accent-gold group-hover:scale-110 transition-transform" />
                )}
                <span className="text-xs text-text-muted group-hover:text-text-primary">
                  {isDownloading ? "Preparing..." : "Download"}
                </span>
              </button>
            </div>

            {/* Create another */}
            <div className="text-center mt-6">
              <button
                onClick={onClose}
                className="text-sm text-accent-pink hover:underline"
              >
                Create Another Card →
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
