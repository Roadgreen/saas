'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { LayoutDashboard, Package, TrendingUp, Settings, ScanLine } from 'lucide-react';
import { useCapacitor } from '@/hooks/useCapacitor';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const { isNative } = useCapacitor();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Sidebar');

  // Only show on native app
  if (!isNative) return null;

  const tabs = [
    { name: t('dashboard'), href: `/${locale}/dashboard`, icon: LayoutDashboard },
    { name: t('stock'), href: `/${locale}/dashboard/products`, icon: Package },
    { name: 'Scan', href: `/${locale}/dashboard/products/new`, icon: ScanLine },
    { name: t('sales'), href: `/${locale}/dashboard/sales`, icon: TrendingUp },
    { name: t('settings'), href: `/${locale}/dashboard/settings`, icon: Settings },
  ];

  return (
    <div className="app-bottom-nav">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isDashboard = tab.href === `/${locale}/dashboard`;
          const isActive = isDashboard
            ? pathname === tab.href
            : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const isScan = tab.name === 'Scan';

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'active:scale-95 transition-transform',
                isActive ? 'active' : '',
                isScan ? 'relative' : ''
              )}
            >
              {isScan ? (
                <div className="flex flex-col items-center justify-center gap-1 -mt-3">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-[10px] font-medium text-orange-500">{tab.name}</span>
                </div>
              ) : (
                <>
                  <Icon className={cn("h-5 w-5", isActive && "text-orange-500")} />
                  <span className={cn("font-medium", isActive && "text-orange-500")}>{tab.name}</span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
