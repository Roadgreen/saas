import type { Metadata } from "next";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { LocationProvider } from "@/components/providers/LocationProvider";
import { EmailVerificationBanner } from "@/components/dashboard/EmailVerificationBanner";
import { BottomNav } from "@/components/app/BottomNav";
import { OnboardingModal } from "@/components/onboarding-modal";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

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
  let showVerificationBanner = false;
  let userEmail = "";
  let showOnboarding = false;

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { emailVerified: true, email: true, onboardingCompleted: true },
    });
    showVerificationBanner = !!user && !user.emailVerified;
    userEmail = user?.email ?? "";
    showOnboarding = !!user && !user.onboardingCompleted;
  }

  return (
    <LocationProvider>
      <div className="grid min-h-screen w-full bg-dashboard-grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="flex flex-col has-bottom-nav md:!pb-0">
          <header className="flex h-14 items-center gap-4 glass-sidebar safe-area-top px-4 lg:h-[60px] lg:px-6 md:hidden">
            <MobileNav />
            <div className="w-full flex-1">
              <span className="font-semibold text-white">FoodTracks</span>
            </div>
          </header>
          {showVerificationBanner && (
            <EmailVerificationBanner email={userEmail} />
          )}
          <main className="flex flex-1 flex-col gap-3 px-2 py-3 pb-4 md:gap-4 md:p-6 lg:gap-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
      <BottomNav />
      {showOnboarding && <OnboardingModal />}
    </LocationProvider>
  );
}
