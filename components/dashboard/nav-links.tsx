'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ChefHat, TrendingUp, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';

export function NavLinks({ className }: { className?: string }) {
  const pathname = usePathname();
  const t = useTranslations('Sidebar');
  const locale = useLocale();

  const links = [
    { name: t('dashboard'), href: `/${locale}/dashboard`, icon: LayoutDashboard },
    { name: t('stock'), href: `/${locale}/dashboard/products`, icon: Package },
    { name: t('recipes'), href: `/${locale}/dashboard/recipes`, icon: ChefHat },
    { name: t('sales'), href: `/${locale}/dashboard/sales`, icon: TrendingUp },
    { name: t('settings'), href: `/${locale}/dashboard/settings`, icon: Settings },
  ];

  return (
    <nav className={cn("flex flex-col gap-2", className)}>
      {links.map((link) => {
        const LinkIcon = link.icon;
        // Check if active, handling locale prefix
        // For the main dashboard link, we want exact match to avoid highlighting it on sub-pages
        const isDashboard = link.href === `/${locale}/dashboard`;
        const isActive = isDashboard 
          ? pathname === link.href 
          : pathname === link.href || pathname.startsWith(`${link.href}/`);
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
              isActive 
                ? "bg-muted text-primary" 
                : "text-muted-foreground"
            )}
          >
            <LinkIcon className="h-4 w-4" />
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
