'use client';

import { useState, useEffect } from 'react';
import { Camera, Cpu, Save, Lightbulb, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'scanner-tutorial-seen';

export function ScannerTutorial() {
  const t = useTranslations('ContextualHelp');
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setShow(true);
    }
  }, []);

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const steps = [
    {
      icon: Camera,
      text: t('scannerTutorialStep1'),
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      icon: Cpu,
      text: t('scannerTutorialStep2'),
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
    {
      icon: Save,
      text: t('scannerTutorialStep3'),
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/[0.06] via-transparent to-amber-500/[0.04] p-4 mb-4"
        >
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 rounded-md p-1 text-muted-foreground/40 hover:text-muted-foreground/70 hover:bg-orange-500/10 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <div className="rounded-lg bg-orange-500/10 p-1.5">
              <Lightbulb className="h-4 w-4 text-orange-500" />
            </div>
            {t('scannerTutorialTitle')}
          </h4>

          <div className="space-y-2.5">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500/10 text-[10px] font-bold text-orange-500">
                    {i + 1}
                  </span>
                  <div className={`shrink-0 rounded-lg ${step.bg} p-1.5`}>
                    <step.icon className={`h-3.5 w-3.5 ${step.color}`} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.text}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground/50 italic max-w-[60%]">
              {t('scannerTutorialTip')}
            </p>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              className="h-7 text-xs text-orange-500 hover:text-orange-600 hover:bg-orange-500/10"
            >
              {t('scannerTutorialGotIt')}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
