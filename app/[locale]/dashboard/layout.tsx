import type { Metadata } from "next";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { LocationProvider } from "@/components/providers/LocationProvider";
import { EmailVerificationBanner } from "@/components/dashboard/EmailVerificationBanner";
import { UpgradeBanner } from "@/components/dashboard/UpgradeBanner";
import { DaysUsedNudge } from "@/components/dashboard/DaysUsedNudge";
import { BottomNav } from "@/components/app/BottomNav";
import { DashboardShell } from "@/components/app/DashboardShell";
import { OnboardingModal } from "@/components/onboarding-modal";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if the current user has verified their email
  const session = await auth();

  // Redirect unauthenticated users to login (defense-in-depth, middleware handles this too)
  if (!session?.user?.email) {
    redirect('/login');
  }

  let showVerificationBanner = false;
  let userEmail = "";
  let showOnboarding = false;
  let showUpgradeBanner = false;
  let trialDaysUsed: number | null = null;
  let isTrialing = false;

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        emailVerified: true,
        email: true,
        onboardingCompleted: true,
        role: true,
        business: {
          select: {
            subscriptionTier: true,
            subscriptionStatus: true,
            trialEndsAt: true,
            createdAt: true,
          },
        },
      },
    });
    showVerificationBanner = !!user && !user.emailVerified;
    userEmail = user?.email ?? "";
    showOnboarding = !!user && !user.onboardingCompleted;

    // Show upgrade banner for FREE users who are not admins
    if (user?.business) {
      const tier = user.business.subscriptionTier;
      const isAdmin = user.role === "ADMIN";
      showUpgradeBanner = tier === "FREE" && !isAdmin;

      // Calculate trial days if user is trialing
      if (user.business.subscriptionStatus === "TRIALING" && user.business.trialEndsAt) {
        isTrialing = true;
        const now = new Date();
        const trialEnd = new Date(user.business.trialEndsAt);
        const totalDays = 14;
        const msLeft = trialEnd.getTime() - now.getTime();
        const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
        trialDaysUsed = Math.max(1, totalDays - daysLeft + 1);
      } else if (tier === "FREE") {
        // For FREE users not yet trialing, show days since account creation
        const created = new Date(user.business.createdAt);
        const now = new Date();
        const daysSinceCreation = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        trialDaysUsed = daysSinceCreation + 1;
      }
    }
  }

  return (
    <LocationProvider>
      <div className="grid min-h-screen w-full bg-dashboard-grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="flex flex-col min-w-0" id="dashboard-content">
          <header className="sticky top-0 z-50 flex h-14 items-center gap-4 glass-sidebar safe-area-top px-4 lg:h-[60px] lg:px-6 md:hidden">
            <MobileNav />
            <div className="w-full flex-1">
              <span className="font-semibold text-white">FoodTracks</span>
            </div>
          </header>
          {showUpgradeBanner && (
            <UpgradeBanner
              trialDaysUsed={trialDaysUsed}
              isTrialing={isTrialing}
            />
          )}
          {showVerificationBanner && (
            <EmailVerificationBanner email={userEmail} />
          )}
          <main className="flex flex-1 flex-col gap-3 px-2 py-3 pb-4 md:gap-4 md:p-6 lg:gap-6 lg:p-8 max-w-full overflow-x-hidden">
            <DashboardShell>
              {children}
            </DashboardShell>
          </main>
        </div>
      </div>
      <BottomNav />
      {showOnboarding && <OnboardingModal />}
      {showUpgradeBanner && <DaysUsedNudge daysUsed={trialDaysUsed} />}
    </LocationProvider>
  );
}
