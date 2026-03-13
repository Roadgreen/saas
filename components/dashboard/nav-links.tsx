'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ChefHat, TrendingUp, Settings, FileDown, BarChart3, Plug, CreditCard, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';
import { useSession } from 'next-auth/react';

export function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname();
  const t = useTranslations('Sidebar');
  const locale = useLocale();
  const { data: session } = useSession();

  // @ts-ignore
  const isPremium = session?.user?.subscriptionTier === 'PRO' || session?.user?.subscriptionTier === 'ENTERPRISE';

  const links = [
    { name: t('dashboard'), href: `/${locale}/dashboard`, icon: LayoutDashboard },
    { name: t('stock'), href: `/${locale}/dashboard/products`, icon: Package },
    { name: t('recipes'), href: `/${locale}/dashboard/recipes`, icon: ChefHat },
    { name: t('sales'), href: `/${locale}/dashboard/sales`, icon: TrendingUp },
    { name: t('sumup'), href: `/${locale}/dashboard/sumup`, icon: CreditCard },
    { name: t('integrations'), href: `/${locale}/dashboard/integrations`, icon: Plug },
    { name: t('settings'), href: `/${locale}/dashboard/settings`, icon: Settings },
    { name: t('billing'), href: `/${locale}/dashboard/settings/billing`, icon: Receipt },
  ];

  if (isPremium) {
    links.splice(4, 0, { name: t('analytics'), href: `/${locale}/dashboard/analytics`, icon: BarChart3 });
    links.push({ name: t('exportData'), href: '/api/export/csv', icon: FileDown });
  }

  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isDashboard = link.href === `/${locale}/dashboard`;
        const isActive = isDashboard
          ? pathname === link.href
          : pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-3 text-base md:text-sm font-medium transition-all duration-200 ease-out",
              isActive
                ? "nav-active-glow text-white"
                : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
            )}
          >
            <LinkIcon className={cn("h-5 w-5 md:h-4 md:w-4 transition-colors duration-200", isActive ? "text-orange-400" : "text-gray-500")} />
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
