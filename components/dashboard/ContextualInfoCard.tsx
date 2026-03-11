'use client';

import { useState } from 'react';
import { Info, X, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContextualInfoCardProps {
  message: string;
  learnMore?: string;
  icon?: 'info' | 'lightbulb';
  dismissible?: boolean;
  storageKey?: string;
  compact?: boolean;
}

export function ContextualInfoCard({
  message,
  learnMore,
  icon = 'info',
  dismissible = true,
  storageKey,
  compact = false,
}: ContextualInfoCardProps) {
  const [dismissed, setDismissed] = useState(() => {
    if (!dismissible || !storageKey) return false;
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`contextual-help-${storageKey}`) === 'dismissed';
  });

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (storageKey) {
      localStorage.setItem(`contextual-help-${storageKey}`, 'dismissed');
    }
  };

  const IconComponent = icon === 'lightbulb' ? Lightbulb : Info;

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`
            relative rounded-xl border border-orange-500/20
            bg-gradient-to-r from-orange-500/[0.06] to-amber-500/[0.04]
            ${compact ? 'px-3 py-2' : 'px-4 py-3'}
          `}
        >
          <div className="flex items-start gap-3">
            <div className={`shrink-0 rounded-lg bg-orange-500/10 ${compact ? 'p-1.5' : 'p-2'}`}>
              <IconComponent className={`${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} text-orange-500`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`${compact ? 'text-xs' : 'text-sm'} text-muted-foreground leading-relaxed`}>
                {message}
              </p>
              {learnMore && (
                <p className={`${compact ? 'text-[10px]' : 'text-xs'} text-muted-foreground/60 mt-1`}>
                  {learnMore}
                </p>
              )}
            </div>
            {dismissible && (
              <button
                onClick={handleDismiss}
                className="shrink-0 rounded-md p-1 text-muted-foreground/40 hover:text-muted-foreground/70 hover:bg-orange-500/10 transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
