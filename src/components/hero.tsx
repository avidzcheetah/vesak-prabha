"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

function LotusParticle({
  delay,
  x,
  size,
  duration,
}: {
  delay: number;
  x: number;
  size: number;
  duration: number;
}) {
  return (
    <motion.div
      className="absolute bottom-0 pointer-events-none"
      style={{ left: `${x}%` }}
      initial={{ y: "100%", opacity: 0, rotate: 0, scale: 0.5 }}
      animate={{
        y: [0, -800],
        opacity: [0, 1, 1, 0],
        rotate: [0, 360],
        scale: [0.5, 1, 0.8, 0.3],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className="text-accent-pink/30"
      >
        <path
          d="M12 2C12 2 8 8 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 8 12 2 12 2Z"
          fill="currentColor"
        />
      </svg>
    </motion.div>
  );
}

function FloatingLantern({
  delay,
  x,
  size,
  duration,
}: {
  delay: number;
  x: number;
  size: number;
  duration: number;
}) {
  return (
    <motion.div
      className="absolute bottom-0 pointer-events-none"
      style={{ left: `${x}%` }}
      initial={{ y: "100%", opacity: 0, rotate: -10, scale: 0.6 }}
      animate={{
        y: [0, -900],
        opacity: [0, 0.8, 0.8, 0],
        rotate: [-15, 15, -15],
        scale: [0.6, 1.1, 0.9, 0.5],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        width={size}
        height={size * 1.5}
        viewBox="0 0 40 60"
        fill="none"
        className="text-accent-gold/45 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
      >
        {/* Main Diamond */}
        <polygon
          points="20,5 32,20 20,35 8,20"
          fill="url(#lanternGlowParticle)"
          stroke="#FCD34D"
          strokeWidth="1"
          opacity="0.8"
        />
        {/* Side diamonds/triangles */}
        <polygon points="8,20 2,22 8,26" fill="#F59E0B" opacity="0.6" />
        <polygon points="32,20 38,22 32,26" fill="#F59E0B" opacity="0.6" />
        <polygon points="20,5 20,20 32,20" fill="#FDE68A" opacity="0.4" />
        {/* Hanging Tassels */}
        <line x1="20" y1="35" x2="20" y2="48" stroke="#F59E0B" strokeWidth="1" />
        <line x1="14" y1="31" x2="11" y2="44" stroke="#D97706" strokeWidth="0.8" />
        <line x1="26" y1="31" x2="29" y2="44" stroke="#D97706" strokeWidth="0.8" />
        {/* Tassel tails */}
        <path d="M20,48 Q18,52 20,56" stroke="#FCD34D" strokeWidth="0.6" />
        <path d="M11,44 Q9,48 11,52" stroke="#F59E0B" strokeWidth="0.6" />
        <path d="M29,44 Q31,48 29,52" stroke="#F59E0B" strokeWidth="0.6" />
        
        <defs>
          <radialGradient id="lanternGlowParticle" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="60%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

function AnimatedLantern() {
  return (
    <motion.div
      className="relative"
      animate={{ rotate: [-3, 3, -3] }}
      transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
    >
      <svg
        width="120"
        height="160"
        viewBox="0 0 120 160"
        className="lantern-glow"
      >
        {/* Lantern string */}
        <line x1="60" y1="0" x2="60" y2="30" stroke="#F59E0B" strokeWidth="2" />
        {/* Lantern top hook */}
        <circle cx="60" cy="28" r="4" fill="#F59E0B" />
        {/* Main lantern body - star shape */}
        <polygon
          points="60,35 75,60 100,65 80,85 85,110 60,98 35,110 40,85 20,65 45,60"
          fill="url(#lanternGrad)"
          stroke="#FCD34D"
          strokeWidth="1.5"
          opacity="0.9"
        />
        {/* Inner glow */}
        <polygon
          points="60,45 70,60 85,63 72,78 75,95 60,87 45,95 48,78 35,63 50,60"
          fill="#FCD34D"
          opacity="0.4"
        />
        {/* Candle flame */}
        <ellipse cx="60" cy="72" rx="6" ry="10" fill="#FDE68A" opacity="0.8">
          <animate
            attributeName="ry"
            values="10;8;10;12;10"
            dur="1.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.8;0.6;0.8;1;0.8"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </ellipse>
        {/* Bottom tassel */}
        <line x1="60" y1="110" x2="60" y2="130" stroke="#F59E0B" strokeWidth="1.5" />
        <circle cx="60" cy="133" r="3" fill="#F59E0B" />
        <defs>
          <linearGradient id="lanternGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

interface ParticleData {
  id: number;
  delay: number;
  x: number;
  size: number;
  duration: number;
}

export default function Hero() {
  const [particles, setParticles] = useState<ParticleData[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 14 }, (_, i) => ({
      id: i,
      delay: i * 0.7,
      x: 5 + Math.random() * 90,
      size: 16 + Math.random() * 16,
      duration: i % 2 === 0 ? 10 + Math.random() * 5 : 14 + Math.random() * 6,
    }));
    setParticles(generated);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-primary to-bg-card" />

      {/* Background Image (very low opacity) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.16] pointer-events-none mix-blend-lighten"
        style={{ backgroundImage: "url('/vesak-bg.png')" }}
      />
      {/* Bottom gradient overlay to fade out the background image */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none" />

      {/* Radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-pink/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-accent-gold/5 rounded-full blur-[100px]" />

      {/* Floating particles (Lotus + Lanterns) */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p, idx) => (
          idx % 2 === 0 ? (
            <LotusParticle
              key={p.id}
              delay={p.delay}
              x={p.x}
              size={p.size}
              duration={p.duration}
            />
          ) : (
            <FloatingLantern
              key={p.id}
              delay={p.delay}
              x={p.x}
              size={p.size * 1.3}
              duration={p.duration}
            />
          )
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Lantern */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <AnimatedLantern />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-sinhala-display leading-[1.25] pb-4 mb-2 overflow-visible"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="text-accent-gold-light py-2 px-2 inline-block drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]">වෙසක් ප්‍රභා</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl sm:text-2xl md:text-3xl font-display text-text-primary/80 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Share the Light
        </motion.p>
        <motion.p
          className="text-lg sm:text-xl text-accent-gold/70 font-sinhala-display font-medium mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          ආලෝකය බෙදා ගන්න
        </motion.p>

        {/* Description */}
        <motion.p
          className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto mb-10 text-balance"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Create a personalised digital Vesak card in under two minutes.
          Choose from stunning templates, add your message in Sinhala or English,
          and share the light with loved ones.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link href="/create" className="btn-primary text-lg px-10 py-4 group">
            <Sparkles className="w-5 h-5 mr-2" />
            Create Your Card
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#templates" className="btn-secondary text-lg px-8 py-4">
            Browse Templates
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex items-center justify-center gap-8 mt-12 text-sm text-text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
            <span>8 Templates</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-pink animate-pulse" />
            <span>Bilingual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-purple animate-pulse" />
            <span>Free to Use</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-text-muted/30 flex items-start justify-center p-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-accent-gold"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
