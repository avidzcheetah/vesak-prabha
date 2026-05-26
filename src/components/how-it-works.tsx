"use client";

import { motion } from "framer-motion";
import { Palette, PenLine, Share2 } from "lucide-react";

const steps = [
  {
    icon: Palette,
    title: "Choose a Template",
    title_si: "සැකිල්ලක් තෝරන්න",
    description: "Browse 8 stunning Vesak-themed designs — from golden lotuses to illuminated pandals.",
    gradient: "from-accent-gold to-yellow-300",
    glow: "rgba(245, 158, 11, 0.3)",
  },
  {
    icon: PenLine,
    title: "Personalise",
    title_si: "පුද්ගලීකරණය",
    description: "Add names, write your Vesak wish in Sinhala or English, and watch the live preview update instantly.",
    gradient: "from-accent-pink to-accent-purple",
    glow: "rgba(246, 1, 167, 0.3)",
  },
  {
    icon: Share2,
    title: "Share the Light",
    title_si: "ආලෝකය බෙදන්න",
    description: "Get a unique link, share via WhatsApp or Facebook, or download the card as a beautiful PNG.",
    gradient: "from-accent-purple to-blue-400",
    glow: "rgba(170, 0, 255, 0.3)",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function HowItWorks() {
  return (
    <section className="py-24 relative" id="how-it-works">
      <div className="section-container">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-display mb-3">
            Create in <span className="text-gradient-fuchsia">Three Steps</span>
          </h2>
          <p className="text-text-muted text-lg max-w-lg mx-auto">
            From template to shared card in under two minutes.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="relative group"
            >
              <div className="card-surface p-8 h-full text-center group-hover:border-border-light transition-all duration-300">
                {/* Step number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-bg-primary border border-border text-xs font-bold text-text-muted">
                    {i + 1}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} mb-6 group-hover:shadow-[0_0_30px_${step.glow}] transition-shadow duration-300`}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-text-primary mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-accent-gold/60 font-sinhala mb-4">
                  {step.title_si}
                </p>

                {/* Description */}
                <p className="text-text-muted text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector line (desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 lg:-right-5 w-8 lg:w-10 border-t border-dashed border-border" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
