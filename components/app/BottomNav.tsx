'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { LayoutDashboard, Package, TrendingUp, Settings, ScanLine } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCapacitor } from '@/hooks/useCapacitor';
import { useHaptic } from '@/hooks/useHaptic';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  notificationCount?: number;
}

export function BottomNav({ notificationCount = 0 }: BottomNavProps) {
  const { isNative } = useCapacitor();
  const { impact } = useHaptic();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Sidebar');

  // Add bottom padding to content area when native bottom nav is visible
  useEffect(() => {
    const content = document.getElementById('dashboard-content');
    if (!content) return;
    if (isNative) {
      content.classList.add('has-bottom-nav');
    } else {
      content.classList.remove('has-bottom-nav');
    }
    return () => {
      content?.classList.remove('has-bottom-nav');
    };
  }, [isNative]);

  // Only show on native app
  if (!isNative) return null;

  const tabs = [
    { name: t('dashboard'), href: `/${locale}/dashboard`, icon: LayoutDashboard, badge: 0 },
    { name: t('stock'), href: `/${locale}/dashboard/products`, icon: Package, badge: 0 },
    { name: 'Scan', href: `/${locale}/dashboard/products/new`, icon: ScanLine, badge: 0 },
    { name: t('sales'), href: `/${locale}/dashboard/sales`, icon: TrendingUp, badge: 0 },
    { name: t('settings'), href: `/${locale}/dashboard/settings`, icon: Settings, badge: notificationCount },
  ];

  return (
    <motion.div
      className="app-bottom-nav"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30, delay: 0.1 }}
    >
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
              onClick={() => impact('light')}
              className={cn(
                'relative',
                isActive ? 'active' : ''
              )}
            >
              {isScan ? (
                <div className="flex flex-col items-center justify-center gap-1 -mt-3">
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30"
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </motion.div>
                  <span className="text-[10px] font-medium text-orange-500">{tab.name}</span>
                </div>
              ) : (
                <motion.div
                  className="flex flex-col items-center justify-center gap-0.5 relative"
                  whileTap={{ scale: 0.85 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <div className="relative">
                    <motion.div
                      animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5 transition-colors duration-200',
                          isActive ? 'text-orange-500' : ''
                        )}
                      />
                    </motion.div>

                    {/* Notification badge */}
                    {tab.badge > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 flex items-center justify-center"
                      >
                        <span className="text-[9px] font-bold text-white leading-none">
                          {tab.badge > 99 ? '99+' : tab.badge}
                        </span>
                      </motion.div>
                    )}
                  </div>

                  <span
                    className={cn(
                      'font-medium transition-colors duration-200',
                      isActive ? 'text-orange-500' : ''
                    )}
                  >
                    {tab.name}
                  </span>

                  {/* Active indicator dot */}
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute -bottom-1 w-1 h-1 rounded-full bg-orange-500"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.div>
              )}
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
