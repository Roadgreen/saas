'use client';

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from 'next-intl';
import { useState, useRef } from 'react';
import { useInView } from 'framer-motion';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/landing/AnimatedSection';
import { CountUp } from '@/components/landing/CountUp';
import {
  CheckCircle2,
  TrendingUp, Package, ScanLine, BarChart3, Zap,
  ChevronDown, ChefHat, CreditCard, Smartphone, Monitor, FileText,
  ArrowRight, Shield,
  Wheat, Truck, Sandwich, IceCream, Coffee, Tent,
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
    <div style={{ borderBottom: '1px solid #EDEBE8' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-7 text-left gap-6 group"
      >
        <span className="font-semibold text-gray-900 text-base md:text-lg transition-colors duration-200 group-hover:text-orange-600">{question}</span>
        <div
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-400"
          style={{
            backgroundColor: open ? 'rgba(249,115,22,0.1)' : 'rgba(0,0,0,0.03)',
          }}
        >
          <ChevronDown
            className="h-4 w-4 transition-transform duration-400"
            style={{
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              color: open ? '#F97316' : '#9CA3AF',
            }}
          />
        </div>
      </button>
      <div
        style={{
          maxHeight: open ? '500px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
          opacity: open ? 1 : 0,
        }}
      >
        <p className="pb-8 text-sm md:text-base leading-[1.8] max-w-2xl" style={{ color: '#6B7280', transition: 'opacity 0.3s ease' }}>{answer}</p>
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

export default function HomeClient() {
  const t  = useTranslations('Landing');
  const locale = useLocale();

  return (
    <>
      {/* ══════════════════════════════════════
          INTEGRATIONS TRUST BAR
          ══════════════════════════════════════ */}
      <section
        className="py-6 relative"
        style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #F0EDE8', borderBottom: '1px solid #F0EDE8' }}
      >
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
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
          TRUST BADGES — security & compliance
          ══════════════════════════════════════ */}
      <section className="py-5" style={{ backgroundColor: '#FAFAF8' }}>
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            {[
              { icon: <Shield className="h-4 w-4" />, label: t('trust.gdpr') },
              { icon: <span className="text-sm">🇫🇷</span>, label: t('trust.madeInFrance') },
              { icon: <Shield className="h-4 w-4" />, label: t('trust.ssl') },
              { icon: <Shield className="h-4 w-4" />, label: t('trust.servers') },
              { icon: <CheckCircle2 className="h-4 w-4" />, label: t('trust.noCommitment') },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs font-medium" style={{ color: '#78716C' }}>
                <span style={{ color: '#A8A29E' }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          POUR QUI ? — 6 verticals grid
          ══════════════════════════════════════ */}
      <section className="py-24 md:py-36 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-cross-hatch pointer-events-none opacity-40" />
        <div className="container relative mx-auto px-5 sm:px-8 lg:px-16">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-jakarta text-3xl md:text-[2.75rem] font-bold mb-5 text-gray-900 tracking-tight">
              {t('verticals.title')}
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">{t('verticals.subtitle')}</p>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {([
              { key: 'bakery',    Icon: Wheat,    href: `/${locale}/boulangerie` },
              { key: 'foodtruck', Icon: Truck,    href: `/${locale}/food-truck-management-software` },
              { key: 'snack',     Icon: Sandwich, href: `/${locale}/snack` },
              { key: 'icecream',  Icon: IceCream, href: `/${locale}/glacier` },
              { key: 'cafe',      Icon: Coffee,   href: `/${locale}/cafe` },
              { key: 'market',    Icon: Tent,     href: `/${locale}/marche` },
            ] as const).map(({ key, Icon, href }) => (
              <StaggerItem key={key}>
                <Link
                  href={href}
                  className="rounded-2xl p-6 h-full flex flex-col gap-4 hover-lift transition-all duration-200 block"
                  style={{ backgroundColor: '#FAFAF8', border: '1px solid #E5E0DB' }}
                  data-track-component={`home-verticals-${key}`}
                >
                  <div
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ backgroundColor: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.15)' }}
                  >
                    <Icon className="h-5 w-5" style={{ color: ORANGE }} />
                  </div>
                  <div>
                    <h3 className="font-jakarta font-bold text-gray-900 text-base mb-1">
                      {t(`verticals.items.${key}.name`)}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {t(`verticals.items.${key}.use`)}
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROBLEM — white + chef photo
          ══════════════════════════════════════ */}
      <section className="py-24 md:py-36 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-cross-hatch pointer-events-none opacity-60" />
        <div className="container relative mx-auto px-5 sm:px-8 lg:px-16">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">

            {/* Left — food truck chef photo */}
            <AnimatedSection className="relative order-2 md:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-square" style={{ border: '1px solid #E5E0DB' }}>
                <Image
                  src="/Generated-Image-February-21_-2026-10_49AM.jpg"
                  alt="Food truck chef cooking"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                  fetchPriority="high"
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
                <h2 className="font-jakarta text-3xl md:text-[2.75rem] font-bold mb-5 text-gray-900 tracking-tight">
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
          HOW IT WORKS — dark, 4 steps with connecting lines
          ══════════════════════════════════════ */}
      <section id="comment-ca-marche" className="py-24 md:py-36 relative" style={{ backgroundColor: DARK }}>
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-20" />
        <div className="container relative mx-auto px-5 sm:px-8 lg:px-16">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-jakarta text-3xl md:text-[2.75rem] font-bold mb-5 text-white tracking-tight">
              {t('howItWorks.title')}
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#9CA3AF' }}>
              {t('howItWorks.subtitle')}
            </p>
          </AnimatedSection>

          <StaggerContainer className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 max-w-5xl mx-auto">
            {/* Connecting line on desktop */}
            <div
              className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-0.5"
              style={{ background: `linear-gradient(to right, ${ORANGE}, ${ORANGE}, ${TEAL})`, opacity: 0.3 }}
            />

            {/* Step 1 */}
            <StaggerItem>
              <div className="relative flex flex-col items-center text-center space-y-5">
                <div
                  className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-lg"
                  style={{ backgroundColor: ORANGE, boxShadow: `0 0 24px rgba(249,115,22,0.35)` }}
                >
                  1
                </div>
                <div
                  className="p-4 rounded-2xl"
                  style={{ backgroundColor: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)' }}
                >
                  <ScanLine className="h-10 w-10" style={{ color: ORANGE }} />
                </div>
                <h3 className="font-jakarta text-xl font-bold text-white">{t('howItWorks.step1.title')}</h3>
                <p className="text-sm leading-relaxed max-w-[220px]" style={{ color: '#9CA3AF' }}>{t('howItWorks.step1.description')}</p>
                <div className="md:hidden flex justify-center pt-2">
                  <ArrowRight className="h-5 w-5 rotate-90" style={{ color: 'rgba(249,115,22,0.5)' }} />
                </div>
              </div>
            </StaggerItem>

            {/* Step 2 */}
            <StaggerItem>
              <div className="relative flex flex-col items-center text-center space-y-5">
                <div
                  className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-lg"
                  style={{ backgroundColor: ORANGE, boxShadow: `0 0 24px rgba(249,115,22,0.35)` }}
                >
                  2
                </div>
                <div
                  className="p-4 rounded-2xl"
                  style={{ backgroundColor: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)' }}
                >
                  <BarChart3 className="h-10 w-10" style={{ color: ORANGE }} />
                </div>
                <h3 className="font-jakarta text-xl font-bold text-white">{t('howItWorks.step2.title')}</h3>
                <p className="text-sm leading-relaxed max-w-[220px]" style={{ color: '#9CA3AF' }}>{t('howItWorks.step2.description')}</p>
                <div className="md:hidden flex justify-center pt-2">
                  <ArrowRight className="h-5 w-5 rotate-90" style={{ color: 'rgba(249,115,22,0.5)' }} />
                </div>
              </div>
            </StaggerItem>

            {/* Step 3 */}
            <StaggerItem>
              <div className="relative flex flex-col items-center text-center space-y-5">
                <div
                  className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-lg"
                  style={{ backgroundColor: TEAL, boxShadow: `0 0 24px rgba(20,184,166,0.35)` }}
                >
                  3
                </div>
                <div
                  className="p-4 rounded-2xl"
                  style={{ backgroundColor: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.2)' }}
                >
                  <TrendingUp className="h-10 w-10" style={{ color: TEAL }} />
                </div>
                <h3 className="font-jakarta text-xl font-bold text-white">{t('howItWorks.step3.title')}</h3>
                <p className="text-sm leading-relaxed max-w-[220px]" style={{ color: '#9CA3AF' }}>{t('howItWorks.step3.description')}</p>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* CTA button */}
          <AnimatedSection className="text-center mt-14">
            <Link
              href={`/${locale}/register?utm_source=home&utm_medium=howitworks`}
              data-track-component="home-howitworks-cta"
            >
              <button
                className="btn-landing inline-flex items-center justify-center gap-2 rounded-xl font-semibold px-8 py-3.5 border transition-colors duration-200"
                style={{ borderColor: 'rgba(249,115,22,0.4)', color: ORANGE, backgroundColor: 'rgba(249,115,22,0.08)' }}
              >
                {t('hero.ctaPrimary')}
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES — dark, 4 piliers
          ══════════════════════════════════════ */}
      <section id="fonctionnalites" className="py-24 md:py-36 relative" style={{ backgroundColor: DARK }}>
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-20" />
        <div className="container relative mx-auto px-5 sm:px-8 lg:px-16">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-jakarta text-3xl md:text-[2.75rem] font-bold mb-5 text-white tracking-tight">
              {t('features.title')}
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: '#9CA3AF' }}>
              {t('features.subtitle')}
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Predictions */}
            <StaggerItem>
              <div
                className="rounded-2xl p-8 space-y-4 h-full feature-card-dark hover-lift"
                style={{ backgroundColor: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.18)' }}
              >
                <div className="p-3 rounded-xl w-fit" style={{ backgroundColor: 'rgba(249,115,22,0.15)' }}>
                  <TrendingUp className="h-6 w-6" style={{ color: ORANGE }} />
                </div>
                <h3 className="font-jakarta text-lg font-bold text-white">{t('features.predictions.title')}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>{t('features.predictions.description')}</p>
              </div>
            </StaggerItem>

            {/* Stock */}
            <StaggerItem>
              <div
                className="rounded-2xl p-8 space-y-4 h-full feature-card-dark hover-lift"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="p-3 rounded-xl w-fit" style={{ backgroundColor: 'rgba(249,115,22,0.15)' }}>
                  <Package className="h-6 w-6" style={{ color: ORANGE }} />
                </div>
                <h3 className="font-jakarta text-lg font-bold text-white">{t('features.stock.title')}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>{t('features.stock.description')}</p>
              </div>
            </StaggerItem>

            {/* Sales */}
            <StaggerItem>
              <div
                className="rounded-2xl p-8 space-y-4 h-full feature-card-dark hover-lift"
                style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="p-3 rounded-xl w-fit" style={{ backgroundColor: 'rgba(0,182,255,0.15)' }}>
                  <BarChart3 className="h-6 w-6" style={{ color: SUMUP }} />
                </div>
                <h3 className="font-jakarta text-lg font-bold text-white">{t('features.sales.title')}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>{t('features.sales.description')}</p>
              </div>
            </StaggerItem>

            {/* Margins */}
            <StaggerItem>
              <div
                className="rounded-2xl p-8 space-y-4 h-full feature-card-dark hover-lift"
                style={{ backgroundColor: 'rgba(20,184,166,0.06)', border: '1px solid rgba(20,184,166,0.18)' }}
              >
                <div className="p-3 rounded-xl w-fit" style={{ backgroundColor: 'rgba(20,184,166,0.15)' }}>
                  <Zap className="h-6 w-6" style={{ color: TEAL }} />
                </div>
                <h3 className="font-jakarta text-lg font-bold text-white">{t('features.margins.title')}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#9CA3AF' }}>{t('features.margins.description')}</p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROOF — stats strip with CountUp
          ══════════════════════════════════════ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: '#090604' }}>
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-jakarta text-3xl md:text-[2.75rem] font-bold text-white tracking-tight">
              {t('proof.title')}
            </h2>
          </AnimatedSection>
          <AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-4xl mx-auto">
              <div>
                <div className="font-jakarta text-4xl md:text-5xl font-extrabold" style={{ color: ORANGE }}>
                  <CountUp end={87} suffix="%" />
                </div>
                <div className="text-sm mt-2 leading-snug" style={{ color: '#6B7280' }}>{t('proof.stat1.label')}</div>
              </div>
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="font-jakarta text-4xl md:text-5xl font-extrabold" style={{ color: TEAL }}>
                  <CountUp end={5} suffix="h" />
                </div>
                <div className="text-sm mt-2 leading-snug" style={{ color: '#6B7280' }}>{t('proof.stat2.label')}</div>
              </div>
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="font-jakarta text-4xl md:text-5xl font-extrabold text-white">
                  <CountUp end={30} prefix="-" suffix="%" />
                </div>
                <div className="text-sm mt-2 leading-snug" style={{ color: '#6B7280' }}>{t('proof.stat3.label')}</div>
              </div>
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="font-jakarta text-4xl md:text-5xl font-extrabold" style={{ color: ORANGE }}>
                  <CountUp end={12} prefix="+" suffix=" pts" />
                </div>
                <div className="text-sm mt-2 leading-snug" style={{ color: '#6B7280' }}>{t('proof.stat4.label')}</div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PRICING TEASE — light, CTA → /pricing
          ══════════════════════════════════════ */}
      <section style={{ backgroundColor: LIGHT }} className="py-24 md:py-32">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <AnimatedSection className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="font-jakarta text-3xl md:text-[2.75rem] font-bold text-gray-900 tracking-tight">
              {t('pricingTease.title')}
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">{t('pricingTease.subtitle')}</p>
            <div>
              <Link href={`/${locale}/pricing`} data-track-component="home-pricing-tease-cta">
                <button
                  className="btn-landing btn-cta-primary btn-shimmer inline-flex items-center justify-center gap-3 rounded-full font-bold px-10 py-4 text-white text-base"
                  style={{ backgroundColor: ORANGE, boxShadow: '0 12px 40px -4px rgba(249,115,22,0.45)' }}
                >
                  {t('pricingTease.cta')}
                  <ArrowRight className="h-4.5 w-4.5" />
                </button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════
          SUMUP INTEGRATION — dark blue accent (kept for trust)
          ══════════════════════════════════════ */}
      <section
        className="py-24 md:py-36 relative overflow-hidden"
        style={{
          background: `radial-gradient(ellipse 110% 70% at 0% 30%, rgba(0,182,255,0.16) 0%, transparent 50%),
                       radial-gradient(ellipse 80% 60% at 100% 75%, rgba(0,182,255,0.10) 0%, transparent 50%),
                       #07111E`,
          borderTop: '1px solid rgba(0,182,255,0.10)',
          borderBottom: '1px solid rgba(0,182,255,0.08)',
        }}
      >
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-[0.35]" />

        <div className="container relative mx-auto px-5 sm:px-8 lg:px-16">
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

                  <h2 className="font-jakarta text-3xl md:text-[2.75rem] font-bold text-white leading-tight mb-3 tracking-tight">
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
          REASSURANCE — 3 commitments, builds trust
          ══════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-jakarta text-3xl md:text-[2.75rem] font-bold mb-5 text-gray-900 tracking-tight">
              {t('reassurance.title')}
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">{t('reassurance.subtitle')}</p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Shield, titleKey: 'card1Title', descKey: 'card1Desc', color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
              { icon: CheckCircle2, titleKey: 'card2Title', descKey: 'card2Desc', color: '#F97316', bg: '#FFF7ED', border: '#FED7AA' },
              { icon: ChefHat, titleKey: 'card3Title', descKey: 'card3Desc', color: '#6366F1', bg: '#EEF2FF', border: '#C7D2FE' },
            ].map(({ icon: Icon, titleKey, descKey, color, bg, border }) => (
              <StaggerItem key={titleKey}>
                <div
                  className="rounded-2xl p-7 h-full transition-all duration-200 hover:shadow-md"
                  style={{ backgroundColor: bg, border: `1px solid ${border}` }}
                >
                  <div
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl mb-5"
                    style={{ backgroundColor: 'white', border: `1px solid ${border}` }}
                  >
                    <Icon className="h-5 w-5" style={{ color }} />
                  </div>
                  <h3 className="font-jakarta text-lg font-bold text-gray-900 mb-2.5">
                    {t(`reassurance.${titleKey}`)}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t(`reassurance.${descKey}`)}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FAQ — white, clean accordion
          ══════════════════════════════════════ */}
      <section className="py-24 md:py-36 bg-white">
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-jakarta text-3xl md:text-[2.75rem] font-bold mb-5 text-gray-900 tracking-tight section-accent">
              {t('faq.title')}
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">{t('faq.subtitle')}</p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="max-w-2xl mx-auto">
              {(['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'] as const).map((key) => (
                <FAQItem
                  key={key}
                  question={t(`faq.${key}.question`)}
                  answer={t(`faq.${key}.answer`)}
                />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER CTA — dark bandeau + 2 CTAs
          ══════════════════════════════════════ */}
      <section className="relative py-28 md:py-40 overflow-hidden" style={{ backgroundColor: DARK }}>
        <div className="absolute inset-0 bg-dot-grid pointer-events-none opacity-20" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at center 40%, rgba(249,115,22,0.22) 0%, transparent 70%)' }}
        />
        <Particles />

        <div className="container relative mx-auto px-5 sm:px-8 lg:px-16">
          <AnimatedSection className="text-center max-w-3xl mx-auto space-y-10">
            <h2 className="font-jakarta text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              {t('footerCta.title')}
            </h2>
            <p className="text-xl leading-[1.7] max-w-xl mx-auto" style={{ color: '#8B8B8B' }}>
              {t('footerCta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/${locale}/register?utm_source=home&utm_medium=footer_cta`}
                data-track-component="home-footer-cta-primary"
              >
                <button
                  className="btn-landing btn-cta-primary btn-shimmer inline-flex items-center justify-center gap-3 rounded-full font-bold px-12 py-5 text-lg text-white"
                  style={{ backgroundColor: ORANGE, boxShadow: '0 16px 48px -4px rgba(249,115,22,0.55)' }}
                >
                  {t('footerCta.primary')}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
              <Link
                href={`/${locale}/pricing`}
                data-track-component="home-footer-cta-secondary"
              >
                <button
                  className="btn-landing inline-flex items-center justify-center gap-2 rounded-full font-medium px-8 py-4 text-base border transition-colors duration-200"
                  style={{ borderColor: 'rgba(249,115,22,0.4)', color: ORANGE, backgroundColor: 'rgba(249,115,22,0.08)' }}
                >
                  {t('footerCta.secondary')}
                </button>
              </Link>
            </div>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {t('hero.noCreditCard')} · {t('hero.cancelAnytime')}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER — darkest, 4-col
          ══════════════════════════════════════ */}
      <footer
        className="py-20 md:py-24 relative"
        style={{ backgroundColor: '#070503', borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="container mx-auto px-5 sm:px-8 lg:px-16">
          <div className="grid md:grid-cols-4 gap-10 mb-14 max-w-6xl mx-auto">
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <ChefHat className="h-6 w-6" style={{ color: ORANGE }} />
                <span className="font-jakarta text-xl font-bold text-white tracking-tight">FoodTracks</span>
              </div>
              <p className="text-sm leading-[1.7]" style={{ color: '#4B5563' }}>
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
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: '#9CA3AF' }}>{t('footer.product')}</h4>
              <ul className="space-y-3 text-sm" style={{ color: '#4B5563' }}>
                <li><Link href={`/${locale}/fonctionnalites`} className="hover:text-gray-300 transition-colors">{t('footer.features')}</Link></li>
                <li><Link href={`/${locale}/pricing`} className="hover:text-gray-300 transition-colors">{t('footer.pricing')}</Link></li>
                <li><Link href={`/${locale}/comment-ca-marche`} className="hover:text-gray-300 transition-colors">{locale === 'fr' ? 'Comment ça marche' : 'How it works'}</Link></li>
                <li><Link href={`/${locale}/security`} className="hover:text-gray-300 transition-colors">{t('footer.security')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: '#9CA3AF' }}>{t('footer.resources')}</h4>
              <ul className="space-y-3 text-sm" style={{ color: '#4B5563' }}>
                <li><Link href={`/${locale}/blog`} className="hover:text-gray-300 transition-colors">{t('footer.blog')}</Link></li>
                <li><Link href={`/${locale}/guides`} className="hover:text-gray-300 transition-colors">{t('footer.guides')}</Link></li>
                <li><Link href={`/${locale}/faq`} className="hover:text-gray-300 transition-colors">FAQ</Link></li>
                <li><Link href={`/${locale}/ville`} className="hover:text-gray-300 transition-colors">{locale === 'fr' ? 'Par ville' : 'By city'}</Link></li>
                <li><Link href={`/${locale}/comparatif`} className="hover:text-gray-300 transition-colors">{locale === 'fr' ? 'Comparatifs' : 'Comparisons'}</Link></li>
                <li><Link href={`/${locale}/support`} className="hover:text-gray-300 transition-colors">{t('footer.support')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: '#9CA3AF' }}>{t('footer.legal')}</h4>
              <ul className="space-y-3 text-sm" style={{ color: '#4B5563' }}>
                <li><Link href={`/${locale}/terms`} className="hover:text-gray-300 transition-colors">{t('footer.terms')}</Link></li>
                <li><Link href={`/${locale}/privacy`} className="hover:text-gray-300 transition-colors">{t('footer.privacy')}</Link></li>
              </ul>
            </div>
          </div>

          <div
            className="pt-10 text-center text-sm"
            style={{ borderTop: '1px solid rgba(255,255,255,0.04)', color: '#374151' }}
          >
            <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════
          STICKY MOBILE CTA
          ══════════════════════════════════════ */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: 'linear-gradient(to top, rgba(13,9,5,0.98) 70%, transparent)',
          paddingTop: '24px',
        }}
      >
        <div className="px-4 pb-4 pt-1">
          <Link href={`/${locale}/register?plan=PRO`} className="block">
            <button
              className="btn-landing btn-cta-primary btn-shimmer w-full rounded-full font-bold py-3.5 text-white text-sm flex items-center justify-center gap-2"
              style={{ backgroundColor: ORANGE, boxShadow: '0 -4px 24px rgba(249,115,22,0.4)' }}
            >
              {t('stickyCtaMobile')}
            </button>
          </Link>
          <p className="text-center text-[11px] mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {t('hero.noCreditCard')}
          </p>
        </div>
      </div>
    </>
  );
}
