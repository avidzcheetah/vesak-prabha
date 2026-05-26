"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import TemplateGallery from "@/components/card-builder/template-gallery";
import BuilderForm from "@/components/card-builder/builder-form";
import CardCanvas from "@/components/card-builder/card-canvas";
import ShareSheet from "@/components/card-builder/share-sheet";
import { getActiveTemplates, type Template } from "@/data/templates";
import { type Language, defaultMessages } from "@/lib/types";
import { defaultWishes } from "@/data/default-wishes";
import { cn } from "@/lib/utils";

export default function CreatePage() {
  const allTemplates = getActiveTemplates();
  const [templates] = useState<Template[]>(allTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(allTemplates[0]);
  const [language, setLanguage] = useState<Language>("en");
  const [sender, setSender] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<{
    slug: string;
    image_url: string;
    card_url: string;
  } | null>(null);

  // Step wizard (0: templates, 1: customise form, 2: preview on mobile)
  const [step, setStep] = useState(0);

  const handleSuggestWish = useCallback(() => {
    const wishes = defaultWishes[language];
    const filteredWishes = wishes.filter((w) => w !== message);
    const pool = filteredWishes.length > 0 ? filteredWishes : wishes;
    const randomIndex = Math.floor(Math.random() * pool.length);
    setMessage(pool[randomIndex]);
  }, [language, message]);

  const handleTemplateSelect = useCallback((template: Template) => {
    setSelectedTemplate(template);
  }, []);

  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
    if (!message) {
      // Don't overwrite user's message
    }
  }, [message]);

  const handleGenerate = async () => {
    if (!sender.trim() || !recipient.trim()) {
      return;
    }

    setIsGenerating(true);

    try {
      const res = await fetch("/api/render-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template_id: selectedTemplate.id,
          language,
          sender: sender.trim(),
          recipient: recipient.trim(),
          message: message.trim() || defaultMessages[language],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedCard(data);
        setShareOpen(true);
      } else {
        // For now, generate a mock result for demo purposes
        const mockSlug = Math.random().toString(36).substring(2, 10);
        setGeneratedCard({
          slug: mockSlug,
          image_url: selectedTemplate.bg_url,
          card_url: `${window.location.origin}/c/${mockSlug}`,
        });
        setShareOpen(true);
      }
    } catch {
      // Demo mode fallback
      const mockSlug = Math.random().toString(36).substring(2, 10);
      setGeneratedCard({
        slug: mockSlug,
        image_url: selectedTemplate.bg_url,
        card_url: `${window.location.origin}/c/${mockSlug}`,
      });
      setShareOpen(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = sender.trim().length > 0 && recipient.trim().length > 0;

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="section-container">
          {/* Page header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold font-display">
              {step === 0 ? "Choose Your " : step === 1 ? "Personalise Your " : "Share Your "}
              <span className="text-gradient-gold">Vesak Card</span>
            </h1>
            <p className="text-text-muted mt-2">
              {step === 0 
                ? "Select from 16 stunning, culturally crafted designs celebrating the festival of light." 
                : step === 1 
                  ? "Enter recipient details and select or compose a beautiful Vesak blessing." 
                  : "Review your custom card design and spread peace and joy."
              }
            </p>
          </motion.div>

          {/* Step Indicator (Desktop + Mobile) */}
          <div className="mb-8 max-w-xl mx-auto">
            <div className="flex items-center justify-between relative">
              {/* Progress bar line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-accent-pink -translate-y-1/2 z-0 transition-all duration-300"
                style={{ width: step === 0 ? "0%" : step === 1 ? "50%" : "100%" }}
              />
              
              {["Choose Template", "Customise Wish", "Share Card"].map((stepLabel, i) => {
                const isActive = step >= i;
                const isCurrent = step === i;
                return (
                  <button
                    key={stepLabel}
                    onClick={() => setStep(i)}
                    className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300",
                      isCurrent 
                        ? "bg-bg-primary border-accent-pink text-accent-pink shadow-[0_0_15px_rgba(246,1,167,0.4)] scale-110" 
                        : isActive 
                          ? "bg-accent-pink border-accent-pink text-white" 
                          : "bg-bg-card border-border text-text-muted hover:border-text-muted"
                    )}>
                      {i + 1}
                    </div>
                    <span className={cn(
                      "text-xs font-medium transition-colors hidden sm:block",
                      isCurrent ? "text-accent-pink" : isActive ? "text-text-primary" : "text-text-muted"
                    )}>
                      {stepLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step wizard content */}
          {step === 0 ? (
            /* STEP 0: Template Selection (Full Width) */
            <motion.div
              key="step-templates"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="card-surface p-6 sm:p-8"
            >
              <TemplateGallery
                selectedId={selectedTemplate.id}
                onSelect={handleTemplateSelect}
                templates={templates}
              />
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setStep(1)}
                  className="btn-primary text-lg px-10 py-4 group"
                >
                  Next: Customise Card
                  <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                </button>
              </div>
            </motion.div>
          ) : (
            /* STEP 1 & 2: Customise & Preview */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* LEFT Column: Form (Step 1) */}
              <div className={cn(
                "lg:col-span-5 xl:col-span-4",
                step !== 1 && "hidden lg:block"
              )}>
                <motion.div
                  className="card-surface p-4 sm:p-5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <button
                    onClick={() => setStep(0)}
                    className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary mb-4 transition-colors font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Templates
                  </button>
                  <BuilderForm
                    sender={sender}
                    recipient={recipient}
                    message={message}
                    language={language}
                    onSenderChange={setSender}
                    onRecipientChange={setRecipient}
                    onMessageChange={setMessage}
                    onLanguageChange={handleLanguageChange}
                    onSuggestWish={handleSuggestWish}
                  />

                  {/* Mobile: Next to preview button */}
                  <div className="lg:hidden mt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="btn-secondary w-full"
                    >
                      Preview Card →
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* RIGHT Column: Live Preview (Step 2 on mobile, always side-by-side on desktop) */}
              <div className={cn(
                "lg:col-span-7 xl:col-span-8",
                step !== 2 && "hidden lg:block"
              )}>
                <motion.div
                  className="sticky top-24"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Preview label */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs text-text-muted uppercase tracking-wider font-medium">
                        Live Preview
                      </span>
                    </div>
                    <span className="text-xs text-text-muted">
                      {selectedTemplate.name_en} · {language === "si" ? "සිංහල" : "English"}
                    </span>
                  </div>

                  {/* Card Canvas */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedTemplate.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardCanvas
                        template={selectedTemplate}
                        sender={sender}
                        recipient={recipient}
                        message={message}
                        language={language}
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Generate Button */}
                  <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={handleGenerate}
                      disabled={!canGenerate || isGenerating}
                      className="btn-primary w-full sm:w-auto text-lg px-10 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Generate & Share
                        </>
                      )}
                    </button>
                    {!canGenerate && (
                      <p className="text-xs text-text-muted">
                        Please fill in the sender and recipient names.
                      </p>
                    )}
                  </div>

                  {/* Mobile: Back to customise button */}
                  <div className="lg:hidden mt-4">
                    <button
                      onClick={() => setStep(1)}
                      className="text-sm text-text-muted hover:text-text-primary transition-colors inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back to Customise
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Share Sheet */}
      {generatedCard && (
        <ShareSheet
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          cardUrl={generatedCard.card_url}
          imageUrl={generatedCard.image_url}
          sender={sender}
          recipient={recipient}
          template={selectedTemplate}
          message={message}
          language={language}
        />
      )}
    </main>
  );
}
