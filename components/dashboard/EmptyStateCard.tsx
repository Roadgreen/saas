"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  /** Delay for stagger animation (in seconds) */
  delay?: number;
  /** Full-page centered variant (for individual pages) */
  fullPage?: boolean;
}

export function EmptyStateCard({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaHref,
  delay = 0,
  fullPage = false,
}: EmptyStateCardProps) {
  if (fullPage) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="flex items-center justify-center min-h-[50vh]"
      >
        <Card className="max-w-md w-full border-dashed border-2 border-primary/20 bg-card/50">
          <CardContent className="flex flex-col items-center text-center gap-4 py-12 px-6">
            <div className="rounded-full bg-primary/10 p-4">
              <Icon className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
            <Button asChild size="lg" className="mt-2">
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="border-dashed border-2 border-primary/20 bg-card/50 hover:border-primary/40 transition-colors">
        <CardContent className="flex flex-col items-center text-center gap-3 py-8 px-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Icon className="h-7 w-7 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[240px]">
              {description}
            </p>
          </div>
          <Button asChild size="sm" className="mt-1">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
