import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-12 border-t border-border/50">
      {/* Top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-pink/30 to-transparent" />

      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/logo.png"
                  alt="වෙසක් ප්‍රභා Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(246,1,167,0.4)]"
                />
              </div>
              <span className="text-lg font-bold font-sinhala-display text-text-primary leading-normal py-0.5 block overflow-visible">
                වෙසක් ප්‍රභා
              </span>
            </Link>
            <p className="text-xs text-text-muted max-w-xs text-center md:text-left">
              Create and share beautiful digital Vesak greeting cards with loved ones.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <Link href="/" className="hover:text-text-primary transition-colors">
              Home
            </Link>
            <Link href="/create" className="hover:text-text-primary transition-colors">
              Create
            </Link>
            <a
              href="https://fuchsialabs.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-pink transition-colors"
            >
              Fuchsia Labs
            </a>
          </div>

          {/* Credit */}
          <div className="flex flex-col items-center md:items-end gap-1">
            <p className="text-xs text-text-muted flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-accent-pink fill-accent-pink" /> by{" "}
              <a
                href="https://fuchsialabs.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-pink hover:underline"
              >
                Fuchsia Labs
              </a>
            </p>
            <p className="text-[11px] text-text-muted/50">
              © {currentYear} Fuchsia Labs. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
