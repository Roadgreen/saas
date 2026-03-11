'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalyticsTooltipProps {
  description: string;
}

export function AnalyticsTooltip({ description }: AnalyticsTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-flex">
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(!open)}
        className="rounded-full p-0.5 text-muted-foreground/40 hover:text-orange-500 hover:bg-orange-500/10 transition-colors"
        aria-label="More info"
      >
        <Info className="h-3.5 w-3.5" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-52 rounded-lg border border-orange-500/20 bg-white px-3 py-2 shadow-lg"
          >
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {description}
            </p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
              <div className="h-2 w-2 rotate-45 border-b border-r border-orange-500/20 bg-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
