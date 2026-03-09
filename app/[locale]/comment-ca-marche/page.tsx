'use client';

import { LandingHeader } from "@/components/landing/Header";
import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/landing/AnimatedSection';
import {
  ScanLine, BarChart3, TrendingUp, Zap,
  ArrowRight, CheckCircle2,
} from "lucide-react";

const STEPS = [
  { icon: ScanLine, key: 'step1' as const, color: '#FF6B35' },
  { icon: BarChart3, key: 'step2' as const, color: '#14B8A6' },
  { icon: TrendingUp, key: 'step3' as const, color: '#FF6B35' },
  { icon: Zap, key: 'step4' as const, color: '#14B8A6' },
];

export default function HowItWorksPage() {
  const t = useTranslations('HowItWorks');
  const locale = useLocale();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFBF7' }}>
      <LandingHeader />

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#0D0905' }}>
        {/* Decorative gradient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: '#FF6B35' }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl" style={{ backgroundColor: '#14B8A6' }} />

        <div className="relative max-w-4xl mx-auto px-6 pt-32 pb-20 text-center">
          <AnimatedSection>
            <span
              className="inline-block text-sm font-semibold tracking-wider uppercase mb-6 px-4 py-1.5 rounded-full"
              style={{ color: '#FF6B35', backgroundColor: 'rgba(255,107,53,0.12)' }}
            >
              FoodTracks
            </span>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
              {t('hero.title')}
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-lg sm:text-xl max-w-2xl mx-auto" style={{ color: '#B8B0A8' }}>
              {t('hero.subtitle')}
            </p>
          </AnimatedSection>

          {/* Scroll indicator */}
          <AnimatedSection delay={0.4}>
            <motion.div
              className="mt-12 flex justify-center"
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <ArrowRight className="w-6 h-6 rotate-90" style={{ color: '#FF6B35' }} />
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Steps Section ─── */}
      <section className="py-20 md:py-28" style={{ backgroundColor: '#FFFBF7' }}>
        <div className="max-w-5xl mx-auto px-6">
          <StaggerContainer className="relative">
            {/* Vertical timeline connector (desktop) */}
            <div
              className="hidden md:block absolute left-[39px] top-12 bottom-12 w-0.5"
              style={{ backgroundColor: '#E8E2DC' }}
            />

            <div className="space-y-12 md:space-y-16">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const bullets = [
                  t(`${step.key}.bullet1`),
                  t(`${step.key}.bullet2`),
                  t(`${step.key}.bullet3`),
                  t(`${step.key}.bullet4`),
                ];

                return (
                  <StaggerItem key={step.key}>
                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 relative">
                      {/* Step number + icon */}
                      <div className="flex-shrink-0 flex items-start gap-4 md:w-20">
                        <div
                          className="relative z-10 w-[78px] h-[78px] rounded-2xl flex items-center justify-center shadow-lg"
                          style={{
                            backgroundColor: `${step.color}14`,
                            border: `2px solid ${step.color}30`,
                          }}
                        >
                          <Icon className="w-8 h-8" style={{ color: step.color }} />
                        </div>
                      </div>

                      {/* Card content */}
                      <div
                        className="flex-1 rounded-2xl p-8 shadow-sm transition-shadow hover:shadow-md"
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E8E2DC',
                        }}
                      >
                        {/* Step label */}
                        <span
                          className="inline-block text-xs font-bold tracking-widest uppercase mb-3"
                          style={{ color: step.color }}
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </span>

                        <h3
                          className="text-xl sm:text-2xl font-bold mb-3"
                          style={{ color: '#0D0905' }}
                        >
                          {t(`${step.key}.title`)}
                        </h3>

                        <p className="text-base mb-5" style={{ color: '#6B6560' }}>
                          {t(`${step.key}.desc`)}
                        </p>

                        {/* Bullet points */}
                        <ul className="space-y-2.5">
                          {bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2.5">
                              <CheckCircle2
                                className="w-5 h-5 flex-shrink-0 mt-0.5"
                                style={{ color: step.color }}
                              />
                              <span className="text-sm" style={{ color: '#3D3A37' }}>
                                {bullet}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#0D0905' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl" style={{ backgroundColor: '#FF6B35' }} />

        <div className="relative max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              {t('cta.title')}
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <p className="text-lg mb-10" style={{ color: '#B8B0A8' }}>
              {t('cta.subtitle')}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <Link
              href={`/${locale}/pricing`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: '#FF6B35' }}
            >
              {t('cta.button')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
