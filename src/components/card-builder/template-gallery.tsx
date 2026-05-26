"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { type Template } from "@/data/templates";
import { cn } from "@/lib/utils";

interface TemplateGalleryProps {
  selectedId: number;
  onSelect: (template: Template) => void;
  templates: Template[];
}

export default function TemplateGallery({
  selectedId,
  onSelect,
  templates,
}: TemplateGalleryProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-accent-gold" />
        <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
          Choose Template
        </h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-4 lg:gap-6">
        {templates.map((template) => {
          const isSelected = template.id === selectedId;
          return (
            <motion.button
              key={template.id}
              onClick={() => onSelect(template)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative aspect-[1200/630] rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer",
                isSelected
                  ? "border-accent-gold shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-[1.02]"
                  : "border-border hover:border-accent-gold/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]"
              )}
            >
              <Image
                src={template.thumbnail_url}
                alt={template.name_en}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {/* Overlay with name */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-2.5 sm:p-4">
                <div className="w-full text-left">
                  <p className="text-[10px] sm:text-sm font-semibold text-white truncate">
                    {template.name_en}
                  </p>
                  <p className="text-[9px] sm:text-xs text-accent-gold/90 font-sinhala truncate mt-0.5">
                    {template.name_si}
                  </p>
                </div>
              </div>
              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-accent-gold flex items-center justify-center"
                >
                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-bg-primary" strokeWidth={3} />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
