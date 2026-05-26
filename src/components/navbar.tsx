"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-t-0 rounded-t-none border-x-0">
      <div className="section-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <img
                src="/logo.png"
                alt="වෙසක් ප්‍රභා Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(246,1,167,0.5)]"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-text-primary leading-normal font-sinhala-display py-0.5 block overflow-visible">
                වෙසක් ප්‍රභා
              </span>
              <span className="text-[10px] text-text-muted leading-none tracking-wider uppercase mt-0.5">
                by Fuchsia Labs
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/create"
              className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200"
            >
              Templates
            </Link>
            <Link href="/create" className="btn-primary text-sm px-6 py-2.5">
              <Sparkles className="w-4 h-4 mr-2" />
              Create Card
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-card transition-all"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden glass-panel border-t border-border mx-4 mb-4 rounded-2xl"
          >
            <div className="flex flex-col p-4 gap-3">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-text-muted hover:text-text-primary py-2 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/create"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-text-muted hover:text-text-primary py-2 transition-colors"
              >
                Templates
              </Link>
              <Link
                href="/create"
                onClick={() => setMobileOpen(false)}
                className="btn-primary text-sm w-full text-center"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create Card
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
