import Link from 'next/link';
import { NavLinks } from './nav-links';
import { Package2 } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { getLocale } from 'next-intl/server';
import { LocationIndicator } from './LocationIndicator';

export async function Sidebar() {
  const locale = await getLocale();
  return (
    <div className="hidden glass-sidebar md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center justify-between border-b border-white/8 px-5 lg:px-6">
          <Link href={`/${locale}`} className="flex items-center gap-2.5 font-semibold">
            <Package2 className="h-5 w-5 text-orange-500" />
            <span className="text-white font-jakarta text-lg tracking-tight">FoodTracks</span>
          </Link>
          <LanguageSwitcher />
        </div>
        <div className="flex-1 py-2">
          <NavLinks className="px-3 lg:px-4" />
        </div>
        <div className="border-t border-white/8 p-4 text-gray-300 [&_p]:text-gray-200 [&_span]:text-gray-400">
          <LocationIndicator />
        </div>
      </div>
    </div>
  );
}
