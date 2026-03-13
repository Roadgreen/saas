'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, MapPin, Brain, ScanLine, Clock, AlertTriangle } from 'lucide-react';
import { X } from 'lucide-react';

export type NudgeType =
  | 'locations'
  | 'predictions'
  | 'scanner'
  | 'days-used'
  | 'limit-reached';

const NUDGE_ICONS: Record<NudgeType, React.ReactNode> = {
  locations: <MapPin className="h-6 w-6 text-orange-400" />,
  predictions: <Brain className="h-6 w-6 text-orange-400" />,
  scanner: <ScanLine className="h-6 w-6 text-orange-400" />,
  'days-used': <Clock className="h-6 w-6 text-orange-400" />,
  'limit-reached': <AlertTriangle className="h-6 w-6 text-orange-400" />,
};

interface UpgradeNudgeProps {
  type: NudgeType;
  open: boolean;
  onClose: () => void;
  /** Optional extra context for limit-reached nudge (e.g., resource name) */
  limitContext?: string;
}

export function UpgradeNudge({ type, open, onClose, limitContext }: UpgradeNudgeProps) {
  const t = useTranslations('UpgradeNudges');
  const locale = useLocale();

  const icon = NUDGE_ICONS[type] ?? <Lock className="h-6 w-6 text-orange-400" />;

  // For limit-reached, we can pass limitContext to the translation
  const title = type === 'limit-reached' && limitContext
    ? t(`${type}.title`, { resource: limitContext })
    : t(`${type}.title`);
  const description = type === 'limit-reached' && limitContext
    ? t(`${type}.description`, { resource: limitContext })
    : t(`${type}.description`);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#1A1410] p-6 shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white/70"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <motion.div
                  className="mb-4 rounded-full bg-orange-500/10 p-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', damping: 15 }}
                >
                  {icon}
                </motion.div>

                {/* Sparkle decoration */}
                <motion.div
                  className="mb-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <Sparkles className="h-4 w-4 text-orange-400/60" />
                </motion.div>

                {/* Title */}
                <motion.h3
                  className="mb-2 text-lg font-bold text-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {title}
                </motion.h3>

                {/* Description */}
                <motion.p
                  className="mb-6 text-sm leading-relaxed text-white/60 max-w-xs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  {description}
                </motion.p>

                {/* CTA Button */}
                <motion.div
                  className="flex w-full flex-col gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    href={`/${locale}/pricing`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:from-orange-400 hover:to-orange-500 hover:shadow-orange-500/30 active:scale-[0.98]"
                  >
                    <Sparkles className="h-4 w-4" />
                    {t('cta')}
                  </Link>

                  <button
                    onClick={onClose}
                    className="rounded-xl px-6 py-2.5 text-sm font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white/70"
                  >
                    {t('later')}
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
