"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Package,
  ChefHat,
  MapPin,
  Truck,
} from "lucide-react";

const STEPS = [
  { key: "step1" as const, icon: Truck, href: null },
  { key: "step2" as const, icon: Package, href: "/dashboard/products" },
  { key: "step3" as const, icon: ChefHat, href: "/dashboard/recipes" },
  { key: "step4" as const, icon: MapPin, href: null },
] as const;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
};

export function OnboardingModal() {
  const t = useTranslations("Onboarding");
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const completeOnboarding = useCallback(async () => {
    try {
      await fetch("/api/onboarding/complete", { method: "POST" });
    } catch {
      // Silently fail — not critical
    }
  }, []);

  const handleNext = useCallback(() => {
    if (step < STEPS.length - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  }, [step]);

  const handleClose = useCallback(async () => {
    setOpen(false);
    await completeOnboarding();
  }, [completeOnboarding]);

  const handleCta = useCallback(
    async (href: string | null) => {
      setOpen(false);
      await completeOnboarding();
      if (href) {
        router.push(`/${locale}${href}`);
      }
    },
    [completeOnboarding, locale, router]
  );

  const currentStep = STEPS[step];
  const Icon = currentStep.icon;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent
        showCloseButton={false}
        className="bg-[#0c0c14] border-white/10 text-white p-0 overflow-hidden sm:max-w-md max-w-[calc(100%-2rem)]"
      >
        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />

        <div className="relative px-6 pt-10 pb-8 sm:px-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col items-center text-center"
            >
              {/* Icon container */}
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 ring-1 ring-orange-500/20">
                <Icon className="h-10 w-10 text-orange-400" strokeWidth={1.5} />
              </div>

              {/* Title */}
              <h2 className="mb-3 text-2xl font-bold tracking-tight">
                {t(`${currentStep.key}.title`)}
              </h2>

              {/* Subtitle */}
              <p className="mb-8 max-w-xs text-sm leading-relaxed text-white/60">
                {t(`${currentStep.key}.subtitle`)}
              </p>

              {/* Buttons */}
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                {step === 0 && (
                  <Button
                    onClick={handleNext}
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-orange-500/25"
                  >
                    {t("step1.cta")}
                  </Button>
                )}

                {(step === 1 || step === 2) && (
                  <>
                    <Button
                      variant="ghost"
                      onClick={handleNext}
                      className="w-full sm:w-auto text-white/50 hover:text-white hover:bg-white/5 rounded-xl"
                    >
                      {t(`${currentStep.key}.skip`)}
                    </Button>
                    <Button
                      onClick={() => handleCta(currentStep.href)}
                      className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-orange-500/25"
                    >
                      {t(`${currentStep.key}.cta`)}
                    </Button>
                  </>
                )}

                {step === 3 && (
                  <Button
                    onClick={handleClose}
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-orange-500/25"
                  >
                    {t("step4.cta")}
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step
                    ? "w-6 bg-orange-500"
                    : i < step
                    ? "w-2 bg-orange-500/50"
                    : "w-2 bg-white/15"
                }`}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
