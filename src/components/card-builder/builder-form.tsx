"use client";

import { type Language, placeholders } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface BuilderFormProps {
  sender: string;
  recipient: string;
  message: string;
  language: Language;
  onSenderChange: (v: string) => void;
  onRecipientChange: (v: string) => void;
  onMessageChange: (v: string) => void;
  onLanguageChange: (lang: Language) => void;
  onSuggestWish: () => void;
}

export default function BuilderForm({
  sender,
  recipient,
  message,
  language,
  onSenderChange,
  onRecipientChange,
  onMessageChange,
  onLanguageChange,
  onSuggestWish,
}: BuilderFormProps) {
  const ph = placeholders[language];
  const maxMessage = 300;

  return (
    <div className="space-y-5">
      {/* Language Toggle */}
      <div>
        <label className="label-text">Language</label>
        <div className="flex items-center bg-bg-primary rounded-xl border border-border p-1 w-fit">
          <button
            onClick={() => onLanguageChange("en")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              language === "en"
                ? "bg-gradient-fuchsia text-white shadow-[0_0_15px_rgba(246,1,167,0.3)]"
                : "text-text-muted hover:text-text-primary"
            )}
          >
            English
          </button>
          <button
            onClick={() => onLanguageChange("si")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-sinhala-display",
              language === "si"
                ? "bg-gradient-fuchsia text-white shadow-[0_0_15px_rgba(246,1,167,0.3)]"
                : "text-text-muted hover:text-text-primary"
            )}
          >
            සිංහල
          </button>
        </div>
      </div>

      {/* Sender Name */}
      <div>
        <label htmlFor="sender" className="label-text">
          {language === "si" ? <span className="font-sinhala-display">යවන්නා</span> : "From"}
        </label>
        <input
          id="sender"
          type="text"
          value={sender}
          onChange={(e) => onSenderChange(e.target.value)}
          placeholder={ph.sender}
          maxLength={80}
          className={cn("input-field", language === "si" && "font-sinhala")}
        />
      </div>

      {/* Recipient Name */}
      <div>
        <label htmlFor="recipient" className="label-text">
          {language === "si" ? <span className="font-sinhala-display">ලබන්නා</span> : "To"}
        </label>
        <input
          id="recipient"
          type="text"
          value={recipient}
          onChange={(e) => onRecipientChange(e.target.value)}
          placeholder={ph.recipient}
          maxLength={80}
          className={cn("input-field", language === "si" && "font-sinhala")}
        />
      </div>

      {/* Message */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label htmlFor="message" className="text-sm font-medium text-text-muted">
            {language === "si" ? <span className="font-sinhala-display">පැතුම් පණිවිඩය</span> : "Wish Message"}
          </label>
          <button
            type="button"
            onClick={onSuggestWish}
            className="inline-flex items-center gap-1 text-xs text-accent-gold hover:text-accent-gold-light transition-colors font-medium"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {language === "si" ? "පැතුමක් යෝජනා කරන්න" : "Suggest a Wish"}
          </button>
        </div>
        <textarea
          id="message"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder={ph.message}
          maxLength={maxMessage}
          rows={4}
          className={cn(
            "input-field resize-none",
            language === "si" && "font-sinhala"
          )}
        />
        <div className="flex justify-end mt-1">
          <span
            className={cn(
              "text-xs",
              message.length > maxMessage * 0.9
                ? "text-red-400"
                : "text-text-muted"
            )}
          >
            {message.length}/{maxMessage}
          </span>
        </div>
      </div>
    </div>
  );
}
