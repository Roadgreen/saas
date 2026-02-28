'use client';

import { LandingHeader } from "@/components/landing/Header";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from 'next-intl';
import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/landing/AnimatedSection';
import { CountUp } from '@/components/landing/CountUp';
import {
  CheckCircle2, MapPin, AlertTriangle,
  TrendingUp, Flame, UserPlus,
  XCircle, Package, ScanLine, BarChart3, Clock, Zap,
  ChevronDown, ChefHat, CreditCard, Smartphone, Monitor, FileText,
  ArrowRight, RefreshCw,
} from "lucide-react";

/* ─── Animated progress bar ─── */
function AnimatedBar({ width, color }: { width: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <div ref={ref} className="w-full rounded-full h-1.5" style={{ backgroundColor: `${color}28` }}>
      <div
        className="h-1.5 rounded-full transition-all duration-1000 ease-out"
        style={{ width: isInView ? `${width}%` : '0%', backgroundColor: color }}
      />
    </div>
  );
}

/* ─── FAQ accordion ─── */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #E8E2DC' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="font-semibold text-gray-900 text-sm md:text-base">{question}</span>
        <ChevronDown
          className="h-4 w-4 flex-shrink-0 transition-transform duration-300"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            color: open ? '#F97316' : '#9CA3AF',
          }}
        />
      </button>
      <div
        style={{
          maxHeight: open ? '400px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <p className="pb-5 text-sm leading-relaxed" style={{ color: '#6B7280' }}>{answer}</p>
      </div>
    </div>
  );
}

/* ─── Particles ─── */
function Particles() {
  const positions = [
    { top: '12%', left: '6%',   duration: '3s',   delay: '0s'   },
    { top: '22%', right: '9%',  duration: '4s',   delay: '1s'   },
    { top: '68%', left: '11%',  duration: '3.5s', delay: '0.5s' },
    { top: '78%', right: '14%', duration: '4.5s', delay: '1.5s' },
    { top: '32%', left: '26%',  duration: '3s',   delay: '2s'   },
    { top: '58%', right: '24%', duration: '5s',   delay: '0.8s' },
    { top: '16%', left: '44%',  duration: '3.8s', delay: '1.2s' },
    { top: '84%', left: '34%',  duration: '4.2s', delay: '0.3s' },
  ];
  return (
    <>
      {positions.map((pos, i) => (
        <div
          key={i}
          className="particle"
          style={{
            top: pos.top,
            ...('left' in pos ? { left: pos.left } : { right: (pos as { right: string }).right }),
            '--duration': pos.duration,
            '--delay': pos.delay,
          } as unknown as React.CSSProperties}
        />
      ))}
    </>
  );
}

const ORANGE  = '#F97316';
const TEAL    = '#14B8A6';
const DARK    = '#0D0905';
const LIGHT   = '#FAFAF8';
const SUMUP   = '#00B6FF';

export default function Home() {
  const t  = useTranslations('Landing');
  const tp = useTranslations('Pricing');
  const locale = useLocale();

  /* locale-aware images */
  const dashboardSrc   = locale === 'fr' ? '/dashboardfr.jpg'  : '/dashboarden.jpg';
  const stockWidgetSrc = locale === 'fr' ? '/stockfr.jpg'       : '/stocken.jpg';

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [1, 2, 3, 4, 5, 6, 7].map((i) => ({
      '@type': 'Question',
      name: t(`faq.q${i}.question`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`faq.q${i}.answer`),
      },
    })),
  };

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <LandingHeader />

      {/* ══════════════════════════════════════
          HERO — dark, full viewport
          ══════════════════════════════════════ */}
      <section
        className="relative overflow-hidden flex items-center"
        style={{ backgroundColor: DARK, minHeight: '100svh' }}
      >
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-30" />
        <div
          className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top right, rgba(249,115,22,0.17) 0%, transparent 65%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at bottom left, rgba(20,184,166,0.07) 0%, transparent 60%)' }}
        />

        <div className="container relative mx-auto px-5 sm:px-8 lg:px-14 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">

            {/* Left — copy */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border"
                style={{ backgroundColor: 'rgba(249,115,22,0.1)', color: '#FDBA74', borderColor: 'rgba(249,115,22,0.25)' }}
              >
                <Flame className="h-3 w-3" /> {t('badge')}
              </span>

              <h1 className="font-jakarta text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold leading-[1.06] text-white">
                {(() => {
                  const parts = t('hero.title').split('.');
                  return (
                    <>
                      {parts[0]}.<br />
                      <span style={{ color: ORANGE }}>{parts.slice(1).join('.').trim()}</span>
                    </>
                  );
                })()}
              </h1>

              <p className="text-lg leading-relaxed max-w-lg" style={{ color: '#9CA3AF' }}>
                {t('hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href={`/${locale}/register?plan=PRO`}>
                  <button
                    className="btn-landing btn-cta-primary btn-shimmer inline-flex items-center justify-center gap-2 rounded-xl font-bold px-8 py-3.5 text-white"
                    style={{ backgroundColor: ORANGE, boxShadow: '0 8px 24px -4px rgba(249,115,22,0.45)' }}
                  >
                    {t('hero.ctaPrimary')}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <a href="#comment-ca-marche">
                  <button
                    className="btn-landing btn-outline-dark inline-flex items-center justify-center rounded-xl font-semibold px-8 py-3.5 border"
                    style={{ borderColor: 'rgba(255,255,255,0.12)', color: '#D1D5DB', backgroundColor: 'transparent' }}
                  >
                    {t('hero.ctaSecondary')}
                  </button>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm" style={{ color: '#6B7280' }}>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" style={{ color: ORANGE }} />
                  {t('hero.noCreditCard')}
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" style={{ color: ORANGE }} />
                  {t('hero.freeToStart')}
                </span>
              </div>
            </motion.div>

            {/* Right — locale-aware dashboard screenshot */}
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            >
              {/* Ambient glow */}
              <div
                className="absolute -inset-8 rounded-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)' }}
              />

              {/* Browser chrome */}
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div
                  className="flex items-center gap-2 px-4 py-3"
                  style={{ backgroundColor: '#1A100A', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF5F57' }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FEBC2E' }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#28C840' }} />
                  </div>
                  <div
                    className="flex-1 mx-3 rounded-md px-3 py-1 text-xs"
                    style={{ backgroundColor: '#0D0905', color: '#4B5563' }}
                  >
                    app.foodtracks.io/dashboard
                  </div>
                </div>
                <Image
                  key={dashboardSrc}
                  src={dashboardSrc}
                  alt="FoodTracks Dashboard"
                  width={1200}
                  height={780}
                  className="w-full"
                  priority
                />
              </div>

              {/* Floating stock widget */}
              <motion.div
                className="absolute -bottom-6 -left-8 rounded-xl overflow-hidden shadow-2xl w-56"
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55 }}
              >
                <Image
                  key={stockWidgetSrc}
                  src={stockWidgetSrc}
                  alt="Stock widget"
                  width={400}
                  height={220}
                  className="w-full"
                />
              </motion.div>

              {/* Accuracy badge */}
              <motion.div
                className="absolute -top-3 -right-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-xl"
                style={{ backgroundColor: ORANGE, color: '#fff' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.75 }}
              >
                <TrendingUp className="h-3 w-3" /> {t('hero.accuracyStat')} accuracy
              </motion.div>

              {/* SumUp sync badge */}
              <motion.div
                className="absolute bottom-16 -right-5 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold shadow-xl"
                style={{
                  backgroundColor: 'rgba(5,18,28,0.95)',
                  border: `1px solid rgba(0,182,255,0.35)`,
                  color: SUMUP,
                  backdropFilter: 'blur(8px)',
                }}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <CreditCard className="h-3.5 w-3.5" />
                SumUp · +€147.50
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
          style={{ background: `linear-gradient(to bottom, transparent, ${DARK})` }}
        />
      </section>

      {/* ══════════════════════════════════════
          INTEGRATIONS TRUST BAR
          ══════════════════════════════════════ */}
      <section
        className="py-5 relative"
        style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #F0EDE8', borderBottom: '1px solid #F0EDE8' }}
      >
        <div className="container mx-auto px-5 sm:px-8 lg:px-14">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 flex-wrap">
            <p
              className="text-xs font-semibold uppercase tracking-widest whitespace-nowrap"
              style={{ color: '#B0A89C' }}
            >
              {t('integrations.title')}
            </p>

            <div className="hidden sm:block h-4 w-px" style={{ backgroundColor: '#E5E0DB' }} />

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {/* SumUp — featured pill */}
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold border"
                style={{
                  backgroundColor: 'rgba(0,182,255,0.06)',
                  borderColor: 'rgba(0,182,255,0.28)',
                  color: '#0090CC',
                }}
              >
                <CreditCard className="h-3.5 w-3.5" style={{ color: SUMUP }} />
                SumUp
                <span
                  className="ml-0.5 text-[10px] font-bold rounded-full px-1.5 py-0.5"
                  style={{ backgroundColor: 'rgba(0,182,255,0.15)', color: SUMUP }}
                >
                  NEW
                </span>
              </span>

              {/* Caisse tactile */}
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium border"
                style={{ borderColor: '#E5E0DB', color: '#78716C' }}
              >
                <Monitor className="h-3.5 w-3.5" />
                {t('integrations.pos')}
              </span>

              {/* TPE mobile */}
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium border"
                style={{ borderColor: '#E5E0DB', color: '#78716C' }}
              >
                <Smartphone className="h-3.5 w-3.5" />
                {t('integrations.tpe')}
              </span>

              {/* Factures PDF */}
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium border"
                style={{ borderColor: '#E5E0DB', color: '#78716C' }}
              >
                <FileText className="h-3.5 w-3.5" />
                {t('integrations.pdf')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROBLEM — white + chef photo
          ══════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-cross-hatch pointer-events-none" />
        <div className="container relative mx-auto px-5 sm:px-8 lg:px-14">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">

            {/* Left — food truck chef photo */}
            <AnimatedSection className="relative order-2 md:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-square" style={{ border: '1px solid #E5E0DB' }}>
                <Image
                  src="/Generated-Image-February-21_-2026-10_49AM.jpg"
                  alt="Food truck chef cooking"
                  fill
                  className="object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(13,9,5,0.55) 0%, transparent 55%)' }}
                />
                <div
                  className="absolute bottom-4 left-4 right-4 rounded-xl px-4 py-3"
                  style={{ backgroundColor: 'rgba(13,9,5,0.88)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}
                >
                  <p className="text-xs font-semibold text-white">{t('problem.photoQuote')}</p>
                  <p className="text-sm font-bold mt-0.5" style={{ color: ORANGE }}>
                    {t('problem.photoAnswer')}
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Right — pain points */}
            <AnimatedSection delay={0.15} className="space-y-8 order-1 md:order-2">
              <div>
                <h2 className="font-jakarta text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  {t('problem.title')}
                </h2>
                <p className="text-lg text-gray-500 leading-relaxed">{t('problem.subtitle')}</p>
              </div>

              <div className="space-y-4">
                {[
                  { emoji: '🤯', titleKey: 'guessTitle',    descKey: 'guessDesc'    },
                  { emoji: '📍', titleKey: 'spotTitle',     descKey: 'spotDesc'     },
                  { emoji: '😰', titleKey: 'shortageTitle', descKey: 'shortageDesc' },
                ].map(({ emoji, titleKey, descKey }) => (
                  <div
                    key={titleKey}
                    className="flex gap-4 p-4 rounded-xl"
                    style={{ backgroundColor: '#FFF5F5', border: '1px solid #FED7D7' }}
                  >
                    <span className="text-2xl flex-shrink-0">{emoji}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{t(`problem.${titleKey}`)}</h3>
                      <p className="text-gray-500 leading-relaxed text-sm mt-0.5">{t(`problem.${descKey}`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          HOW IT WORKS — dark, 3 steps
          ══════════════════════════════════════ */}
      <section id="comment-ca-marche" className="py-16 md:py-24 relative" style={{ backgroundColor: DARK }}>
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-25" />
        <div className="container relative mx-auto px-5 sm:px-8 lg:px-14">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-jakarta text-3xl md:text-4xl font-bold mb-4 text-white">
              {t('howItWorks.title')}
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#9CA3AF' }}>
              {t('howItWorks.subtitle')}
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {/* Step 1 */}
            <StaggerItem>
              <div
                className="rounded-2xl p-7 space-y-4 h-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
                  style={{ backgroundColor: ORANGE }}
                >
                  1
                </div>
                <div className="p-2.5 rounded-lg w-fit" style={{ backgroundColor: 'rgba(249,115,22,0.15)' }}>
                  <UserPlus className="h-6 w-6" style={{ color: ORANGE }} />
                </div>
                <h3 className="font-jakarta text-lg font-bold text-white">{t('howItWorks.step1Title')}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{t('howItWorks.step1Desc')}</p>
              </div>
            </StaggerItem>

            {/* Step 2 — barcode scanner photo */}
            <StaggerItem>
              <div
                className="rounded-2xl overflow-hidden h-full"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="relative h-44">
                  <Image
                    src="/smartphone-with-barcode-scanner-for-restaurant-inv.jpg"
                    alt="Scanning inventory with phone"
                    fill
                    className="object-cover object-center"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(13,9,5,0.92) 100%)' }}
                  />
                  <div
                    className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white"
                    style={{ backgroundColor: ORANGE }}
                  >
                    2
                  </div>
                </div>
                <div className="p-7 space-y-3" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                  <div className="p-2.5 rounded-lg w-fit" style={{ backgroundColor: 'rgba(249,115,22,0.15)' }}>
                    <ScanLine className="h-6 w-6" style={{ color: ORANGE }} />
                  </div>
                  <h3 className="font-jakarta text-lg font-bold text-white">{t('howItWorks.step2Title')}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{t('howItWorks.step2Desc')}</p>
                </div>
              </div>
            </StaggerItem>

            {/* Step 3 */}
            <StaggerItem>
              <div
                className="rounded-2xl p-7 space-y-4 h-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
                  style={{ backgroundColor: TEAL }}
                >
                  3
                </div>
                <div className="p-2.5 rounded-lg w-fit" style={{ backgroundColor: 'rgba(20,184,166,0.15)' }}>
                  <TrendingUp className="h-6 w-6" style={{ color: TEAL }} />
                </div>
                <h3 className="font-jakarta text-lg font-bold text-white">{t('howItWorks.step3Title')}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{t('howItWorks.step3Desc')}</p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PREDICTIONS — cream, analytics screenshot
          ══════════════════════════════════════ */}
      <section id="predictions" style={{ backgroundColor: LIGHT }} className="py-16 md:py-24">
        <div className="container mx-auto px-5 sm:px-8 lg:px-14">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <AnimatedSection className="space-y-6">
              <div
                className="inline-block p-3 rounded-xl"
                style={{ backgroundColor: 'rgba(20,184,166,0.1)' }}
              >
                <TrendingUp className="h-7 w-7" style={{ color: TEAL }} />
              </div>
              <h2 className="font-jakarta text-3xl md:text-4xl font-bold text-gray-900">
                {t('predictions.title')}
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed">{t('predictions.subtitle')}</p>
              <ul className="space-y-3">
                {(['bullet1', 'bullet2', 'bullet3', 'bullet4'] as const).map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: TEAL }} />
                    <span className="text-gray-700">{t(`predictions.${key}`)}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/${locale}/register?plan=PRO`}>
                <button
                  className="btn-landing btn-cta-primary inline-flex items-center gap-2 rounded-xl font-bold px-6 py-3 text-white"
                  style={{ backgroundColor: ORANGE }}
                >
                  {t('hero.ctaPrimary')}
                </button>
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="relative">
              <div
                className="relative rounded-2xl overflow-hidden shadow-xl"
                style={{ border: '1px solid #E5E0DB' }}
              >
                <Image
                  key={dashboardSrc}
                  src={dashboardSrc}
                  alt="FoodTracks dashboard analytics"
                  width={700}
                  height={480}
                  className="w-full"
                />
              </div>
              <div
                className="absolute top-4 -right-4 rounded-xl px-4 py-3 shadow-xl bg-white"
                style={{ border: '1px solid #E5E0DB' }}
              >
                <div className="font-jakarta text-2xl font-extrabold" style={{ color: TEAL }}>
                  {t('hero.accuracyStat')}
                </div>
                <div className="text-xs text-gray-500">{t('hero.accuracyLabel')}</div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STOCK READINESS — white, status cards
          ══════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="absolute inset-0 bg-cross-hatch pointer-events-none" />
        <div className="container relative mx-auto px-5 sm:px-8 lg:px-14">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-block p-3 rounded-xl mb-4" style={{ backgroundColor: 'rgba(249,115,22,0.1)' }}>
              <Package className="h-7 w-7" style={{ color: ORANGE }} />
            </div>
            <h2 className="font-jakarta text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {t('readiness.title')}
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">{t('readiness.subtitle')}</p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            <StaggerItem>
              <div className="rounded-2xl p-6 space-y-3 h-full" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-bold text-green-800">{t('readiness.coveredTitle')}</span>
                </div>
                <div className="text-sm font-semibold text-green-700">{t('readiness.coveredLabel')}</div>
                <p className="text-sm text-green-600">{t('readiness.coveredDesc')}</p>
                <AnimatedBar width={74} color="#22C55E" />
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-2xl p-6 space-y-3 h-full" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="font-bold text-yellow-800">{t('readiness.tightTitle')}</span>
                </div>
                <div className="text-sm font-semibold text-yellow-700">{t('readiness.tightLabel')}</div>
                <p className="text-sm text-yellow-600">{t('readiness.tightDesc')}</p>
                <AnimatedBar width={89} color="#EAB308" />
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-2xl p-6 space-y-3 h-full" style={{ backgroundColor: '#FFF5F5', border: '1px solid #FED7D7' }}>
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-bold text-red-800">{t('readiness.shortTitle')}</span>
                </div>
                <div className="text-sm font-semibold text-red-700">{t('readiness.shortLabel')}</div>
                <p className="text-sm text-red-600">{t('readiness.shortDesc')}</p>
                <AnimatedBar width={36} color="#EF4444" />
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES — dark, bento
          ══════════════════════════════════════ */}
      <section id="fonctionnalites" className="py-16 md:py-24 relative" style={{ backgroundColor: DARK }}>
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-25" />
        <div className="container relative mx-auto px-5 sm:px-8 lg:px-14">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-jakarta text-3xl md:text-4xl font-bold mb-4 text-white">
              {t('features.title')}
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#9CA3AF' }}>
              {t('features.subtitle')}
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {/* Scanner — large card */}
            <StaggerItem className="md:col-span-2">
              <div className="rounded-2xl overflow-hidden h-full" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="relative h-52">
                  <Image
                    src="/smartphone-with-barcode-scanner-for-restaurant-inv.jpg"
                    alt="Mobile inventory scanning"
                    fill
                    className="object-cover object-center"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to bottom, transparent 25%, rgba(13,9,5,0.96) 100%)' }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(249,115,22,0.2)' }}>
                        <ScanLine className="h-4 w-4" style={{ color: ORANGE }} />
                      </div>
                      <span className="text-xs font-bold rounded-full px-2 py-0.5" style={{ backgroundColor: 'rgba(249,115,22,0.2)', color: '#FDBA74' }}>AI</span>
                    </div>
                    <h3 className="font-jakarta text-xl font-bold text-white">{t('features.mobileTitle')}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>{t('features.mobileDesc')}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>

            {/* Margin analytics */}
            <StaggerItem>
              <div
                className="rounded-2xl p-6 space-y-3 h-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="p-2.5 rounded-lg w-fit" style={{ backgroundColor: 'rgba(20,184,166,0.15)' }}>
                  <BarChart3 className="h-6 w-6" style={{ color: TEAL }} />
                </div>
                <h3 className="font-jakarta text-lg font-bold text-white">{t('features.marginTitle')}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{t('features.marginDesc')}</p>
              </div>
            </StaggerItem>

            {/* Multi-spot */}
            <StaggerItem>
              <div
                className="rounded-2xl p-6 space-y-3 h-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="p-2.5 rounded-lg w-fit" style={{ backgroundColor: 'rgba(245,158,11,0.15)' }}>
                  <MapPin className="h-5 w-5" style={{ color: '#F59E0B' }} />
                </div>
                <h3 className="font-jakarta text-lg font-bold text-white">{t('features.multiSpotTitle')}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>{t('features.multiSpotDesc')}</p>
              </div>
            </StaggerItem>

            {/* Stats strip */}
            <StaggerItem className="md:col-span-2">
              <div
                className="rounded-2xl p-6 h-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="grid sm:grid-cols-3 gap-4 h-full items-center text-center">
                  <div className="space-y-1.5">
                    <div className="p-2 rounded-lg w-fit mx-auto" style={{ backgroundColor: 'rgba(249,115,22,0.15)' }}>
                      <Clock className="h-4 w-4" style={{ color: ORANGE }} />
                    </div>
                    <div className="font-jakarta text-2xl font-extrabold text-white">
                      <CountUp end={5} suffix=" min" />
                    </div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>{t('hero.timeLabel')}</div>
                  </div>
                  <div
                    className="space-y-1.5"
                    style={{ borderLeft: '1px solid rgba(255,255,255,0.07)', borderRight: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <div className="p-2 rounded-lg w-fit mx-auto" style={{ backgroundColor: 'rgba(20,184,166,0.15)' }}>
                      <TrendingUp className="h-4 w-4" style={{ color: TEAL }} />
                    </div>
                    <div className="font-jakarta text-2xl font-extrabold text-white">
                      <CountUp end={87} suffix="%" />
                    </div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>{t('hero.accuracyLabel')}</div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="p-2 rounded-lg w-fit mx-auto" style={{ backgroundColor: 'rgba(239,68,68,0.15)' }}>
                      <Zap className="h-4 w-4 text-red-400" />
                    </div>
                    <div className="font-jakarta text-2xl font-extrabold text-white">
                      <CountUp end={30} prefix="-" suffix="%" />
                    </div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>{t('stats.wasteLabel')}</div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SUMUP INTEGRATION — dark blue accent
          ══════════════════════════════════════ */}
      <section
        className="py-16 md:py-24 relative overflow-hidden"
        style={{
          background: `radial-gradient(ellipse 110% 70% at 0% 30%, rgba(0,182,255,0.20) 0%, transparent 50%),
                       radial-gradient(ellipse 80% 60% at 100% 75%, rgba(0,182,255,0.13) 0%, transparent 50%),
                       #07111E`,
          borderTop: '1px solid rgba(0,182,255,0.10)',
          borderBottom: '1px solid rgba(0,182,255,0.08)',
        }}
      >
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-[0.35]" />

        <div className="container relative mx-auto px-5 sm:px-8 lg:px-14">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center max-w-5xl mx-auto">

            {/* Left — copy */}
            <AnimatedSection>
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  border: '1px solid rgba(0,182,255,0.20)',
                  backgroundColor: 'rgba(7,22,38,0.70)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {/* ── Section 1 : badge + titre + sous-titre ── */}
                <div
                  className="px-6 pt-6 pb-5"
                  style={{ borderBottom: '1px solid rgba(0,182,255,0.14)' }}
                >
                  <div
                    className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold border mb-4"
                    style={{ backgroundColor: 'rgba(0,182,255,0.12)', borderColor: 'rgba(0,182,255,0.30)', color: SUMUP }}
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    {t('sumupSection.badge')}
                  </div>

                  <h2 className="font-jakarta text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
                    {t('sumupSection.title')}
                  </h2>
                  <p className="text-base leading-relaxed" style={{ color: '#6B7280' }}>
                    {t('sumupSection.subtitle')}
                  </p>
                </div>

                {/* ── Section 2 : bullets ── */}
                <div
                  className="px-6 py-6"
                  style={{ borderBottom: '1px solid rgba(0,182,255,0.14)' }}
                >
                  <ul className="space-y-5">
                    {(['bullet1', 'bullet2', 'bullet3', 'bullet4'] as const).map((key) => (
                      <li key={key} className="flex items-center gap-4">
                        <div
                          className="flex-shrink-0 h-6 w-6 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: 'rgba(0,182,255,0.15)', border: '1px solid rgba(0,182,255,0.22)' }}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" style={{ color: SUMUP }} />
                        </div>
                        <span className="text-sm font-medium" style={{ color: '#D1D5DB' }}>{t(`sumupSection.${key}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ── Section 3 : CTA ── */}
                <div className="px-6 py-5">
                  <Link href={`/${locale}/register`}>
                    <button
                      className="btn-landing inline-flex items-center gap-2 rounded-xl font-bold px-6 py-3 text-white w-full justify-center"
                      style={{ backgroundColor: SUMUP, boxShadow: '0 8px 28px -4px rgba(0,182,255,0.35)' }}
                    >
                      <CreditCard className="h-4 w-4" />
                      {t('sumupSection.cta')}
                    </button>
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            {/* Right — mock SumUp widget */}
            <AnimatedSection delay={0.2}>
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  border: '1px solid rgba(0,182,255,0.30)',
                  backgroundColor: 'rgba(7,22,38,0.92)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 32px 64px -16px rgba(0,0,0,0.7), 0 0 40px -10px rgba(0,182,255,0.12)',
                }}
              >
                {/* ── Section 1 : titre + montant ── */}
                <div
                  className="px-6 pt-6 pb-5"
                  style={{ borderBottom: '1px solid rgba(0,182,255,0.14)' }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
                        style={{ backgroundColor: 'rgba(0,182,255,0.18)', border: '1px solid rgba(0,182,255,0.25)' }}
                      >
                        <CreditCard className="h-4 w-4" style={{ color: SUMUP }} />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm leading-tight">{t('sumupSection.mockTitle')}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#4B5563' }}>{t('sumupSection.mockSub')}</p>
                      </div>
                    </div>
                    <span
                      className="text-[11px] font-bold rounded-full px-2.5 py-1"
                      style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#4ADE80', border: '1px solid rgba(34,197,94,0.20)' }}
                    >
                      ● Connecté
                    </span>
                  </div>

                  <div className="font-jakarta text-4xl font-extrabold tracking-tight" style={{ color: SUMUP }}>
                    {t('sumupSection.mockAmount')}
                  </div>
                  <p className="text-xs mt-1.5 font-medium" style={{ color: '#4B5563' }}>{t('sumupSection.mockTx')}</p>
                </div>

                {/* ── Section 2 : graphique barres ── */}
                <div
                  className="px-6 pt-5 pb-5"
                  style={{ borderBottom: '1px solid rgba(0,182,255,0.14)' }}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: '#4B5563' }}>
                    Revenus / jour
                  </p>
                  <div className="flex items-end gap-[3px] h-20">
                    {[28, 42, 35, 60, 48, 72, 55, 38, 65, 80, 70, 88, 62, 95, 78].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm"
                        style={{
                          height: `${h}%`,
                          backgroundColor: i === 13
                            ? SUMUP
                            : `rgba(0,182,255,${0.22 + (h / 95) * 0.55})`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* ── Section 3 : taux de match ── */}
                <div className="px-6 pt-4 pb-5">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#4B5563' }}>
                      Taux de match
                    </span>
                    <span className="text-sm font-extrabold text-green-400">100 %</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                    <div className="h-2 w-full rounded-full" style={{ background: 'linear-gradient(90deg, #16A34A, #4ADE80)' }} />
                  </div>
                  <p className="text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
                    <span style={{ color: '#6B7280' }}>{t('sumupSection.mockMatch')}</span>
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS STRIP — near-black, big numbers
          ══════════════════════════════════════ */}
      <section className="py-14" style={{ backgroundColor: '#090604' }}>
        <div className="container mx-auto px-5 sm:px-8 lg:px-14">
          <AnimatedSection>
            <div className="grid grid-cols-3 gap-6 text-center max-w-2xl mx-auto">
              <div>
                <div className="font-jakarta text-4xl md:text-5xl font-extrabold" style={{ color: ORANGE }}>
                  <CountUp end={500} suffix="+" />
                </div>
                <div className="text-sm mt-1.5" style={{ color: '#6B7280' }}>{t('stats.productsLabel')}</div>
              </div>
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.06)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="font-jakarta text-4xl md:text-5xl font-extrabold" style={{ color: TEAL }}>
                  <CountUp end={2} suffix=" min" />
                </div>
                <div className="text-sm mt-1.5" style={{ color: '#6B7280' }}>{t('stats.setupLabel')}</div>
              </div>
              <div>
                <div className="font-jakarta text-4xl md:text-5xl font-extrabold text-white">
                  <CountUp end={100} suffix="%" />
                </div>
                <div className="text-sm mt-1.5" style={{ color: '#6B7280' }}>{t('stats.freeLabel')}</div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PRICING — cream, 3 cards
          ══════════════════════════════════════ */}
      <section id="tarifs" style={{ backgroundColor: LIGHT }} className="py-16 md:py-24">
        <div className="container mx-auto px-5 sm:px-8 lg:px-14">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-jakarta text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {t('pricing.title')}
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">{t('pricing.subtitle')}</p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto items-stretch">
            {/* Free */}
            <StaggerItem>
              <div className="rounded-2xl p-7 space-y-6 h-full bg-white" style={{ border: '1px solid #E5E0DB' }}>
                <div>
                  <h3 className="font-jakarta text-xl font-bold text-gray-900">{tp('free.title')}</h3>
                  <p className="text-sm text-gray-500 mt-1">{tp('free.description')}</p>
                </div>
                <div>
                  <span className="font-jakarta text-4xl font-extrabold text-gray-900">{tp('free.price')}</span>
                </div>
                <ul className="space-y-2.5 flex-1">
                  {(tp.raw('free.features') as string[]).map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/${locale}/register`} className="block">
                  <button className="btn-landing w-full rounded-xl py-2.5 font-semibold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                    {t('pricing.ctaFree')}
                  </button>
                </Link>
              </div>
            </StaggerItem>

            {/* Pro — highlighted */}
            <StaggerItem>
              <div
                className="relative rounded-2xl overflow-hidden h-full"
                style={{
                  border: `2px solid ${ORANGE}`,
                  boxShadow: `0 0 48px rgba(249,115,22,0.18), 0 20px 48px -10px rgba(0,0,0,0.08)`,
                }}
              >
                <div className="py-2.5 text-center text-sm font-bold text-white" style={{ backgroundColor: ORANGE }}>
                  {tp('popular')}
                </div>
                <div className="p-7 space-y-6 bg-white h-[calc(100%-42px)]">
                  <div>
                    <h3 className="font-jakarta text-xl font-bold text-gray-900">{tp('pro.title')}</h3>
                    <p className="text-sm text-gray-500 mt-1">{tp('pro.description')}</p>
                  </div>
                  <div>
                    <span className="font-jakarta text-4xl font-extrabold" style={{ color: ORANGE }}>
                      {tp('pro.price')}
                    </span>
                    <span className="text-gray-500 ml-1 text-sm">{t('pricing.perMonth')}</span>
                  </div>
                  <ul className="space-y-2.5 flex-1">
                    {(tp.raw('pro.features') as string[]).map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: ORANGE }} />
                        <span className="text-gray-700 text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/${locale}/register?plan=PRO`} className="block">
                    <button
                      className="btn-landing btn-cta-primary btn-shimmer w-full rounded-xl py-2.5 font-bold text-sm text-white"
                      style={{ backgroundColor: ORANGE }}
                    >
                      {t('pricing.ctaPro')}
                    </button>
                  </Link>
                </div>
              </div>
            </StaggerItem>

            {/* Enterprise */}
            <StaggerItem>
              <div className="rounded-2xl p-7 space-y-6 h-full bg-white" style={{ border: '1px solid #E5E0DB' }}>
                <div>
                  <h3 className="font-jakarta text-xl font-bold text-gray-900">{tp('enterprise.title')}</h3>
                  <p className="text-sm text-gray-500 mt-1">{tp('enterprise.description')}</p>
                </div>
                <div>
                  <span className="font-jakarta text-3xl font-extrabold text-gray-900">{tp('enterprise.price')}</span>
                </div>
                <ul className="space-y-2.5 flex-1">
                  {(tp.raw('enterprise.features') as string[]).map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="mailto:contact@foodtracks.io" className="block">
                  <button className="btn-landing w-full rounded-xl py-2.5 font-semibold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                    {tp('contact')}
                  </button>
                </a>
              </div>
            </StaggerItem>
          </StaggerContainer>

          <AnimatedSection delay={0.3}>
            <p className="text-center text-sm text-gray-400 mt-8">{t('pricing.disclaimer')}</p>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ — white, clean accordion
          ══════════════════════════════════════ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-5 sm:px-8 lg:px-14">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-jakarta text-3xl md:text-4xl font-bold text-gray-900">
              {t('faq.title')}
            </h2>
          </AnimatedSection>
          <div className="max-w-2xl mx-auto">
            {(['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'] as const).map((key) => (
              <FAQItem
                key={key}
                question={t(`faq.${key}.question`)}
                answer={t(`faq.${key}.answer`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA — dark + food truck background
          ══════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 overflow-hidden" style={{ backgroundColor: DARK }}>
        <div className="absolute inset-0">
          <Image
            src="/Generated-Image-February-21_-2026-11_16AM.jpg"
            alt="Food truck"
            fill
            className="object-cover object-center opacity-20"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(13,9,5,0.7) 0%, rgba(13,9,5,0.85) 100%)' }}
          />
        </div>

        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-20" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.18) 0%, transparent 65%)' }}
        />
        <Particles />

        <div className="container relative mx-auto px-5 sm:px-8 lg:px-14">
          <AnimatedSection className="text-center max-w-3xl mx-auto space-y-8">
            <h2 className="font-jakarta text-4xl md:text-5xl font-extrabold text-white leading-tight">
              {t('cta.title')}
            </h2>
            <p className="text-xl leading-relaxed" style={{ color: '#9CA3AF' }}>
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col items-center gap-4">
              <Link href={`/${locale}/register?plan=PRO`}>
                <button
                  className="btn-landing btn-cta-primary btn-shimmer inline-flex items-center justify-center gap-2 rounded-xl font-bold px-10 py-4 text-lg text-white"
                  style={{ backgroundColor: ORANGE, boxShadow: '0 12px 36px -4px rgba(249,115,22,0.5)' }}
                >
                  {t('cta.button')}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <p className="text-sm" style={{ color: '#4B5563' }}>
                {t('hero.noCreditCard')} · {t('hero.freeToStart')}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER — darkest, 4-col
          ══════════════════════════════════════ */}
      <footer
        className="py-12 relative"
        style={{ backgroundColor: '#070503', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="container mx-auto px-5 sm:px-8 lg:px-14">
          <div className="grid md:grid-cols-4 gap-8 mb-10 max-w-6xl mx-auto">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ChefHat className="h-6 w-6" style={{ color: ORANGE }} />
                <span className="font-jakarta text-xl font-bold text-white">FoodTracks</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#4B5563' }}>
                {t('footer.tagline')}
              </p>
              {/* SumUp integration badge in footer */}
              <div
                className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border"
                style={{ backgroundColor: 'rgba(0,182,255,0.06)', borderColor: 'rgba(0,182,255,0.2)', color: '#0090CC' }}
              >
                <CreditCard className="h-3 w-3" style={{ color: SUMUP }} />
                SumUp intégré
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4" style={{ color: '#D1D5DB' }}>{t('footer.product')}</h4>
              <ul className="space-y-2.5 text-sm" style={{ color: '#4B5563' }}>
                <li><a href="#fonctionnalites" className="hover:text-gray-300 transition-colors">{t('footer.features')}</a></li>
                <li><Link href={`/${locale}/pricing`} className="hover:text-gray-300 transition-colors">{t('footer.pricing')}</Link></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">{t('footer.security')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4" style={{ color: '#D1D5DB' }}>{t('footer.resources')}</h4>
              <ul className="space-y-2.5 text-sm" style={{ color: '#4B5563' }}>
                <li><Link href={`/${locale}/blog`} className="hover:text-gray-300 transition-colors">{t('footer.blog')}</Link></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">{t('footer.guides')}</a></li>
                <li><a href="#" className="hover:text-gray-300 transition-colors">{t('footer.support')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-4" style={{ color: '#D1D5DB' }}>{t('footer.legal')}</h4>
              <ul className="space-y-2.5 text-sm" style={{ color: '#4B5563' }}>
                <li><Link href={`/${locale}/privacy`} className="hover:text-gray-300 transition-colors">{t('footer.mentions')}</Link></li>
                <li><Link href={`/${locale}/privacy`} className="hover:text-gray-300 transition-colors">{t('footer.privacy')}</Link></li>
                <li><Link href={`/${locale}/terms`} className="hover:text-gray-300 transition-colors">{t('footer.terms')}</Link></li>
              </ul>
            </div>
          </div>

          <div
            className="pt-8 text-center text-sm"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: '#374151' }}
          >
            <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
