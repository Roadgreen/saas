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
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-4 lg:h-[60px] lg:px-6">
          <Link href={`/${locale}`} className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6 text-orange-500" />
            <span className="text-white">FoodTracks</span>
          </Link>
          <LanguageSwitcher />
        </div>
        <div className="flex-1">
          <NavLinks className="px-2 lg:px-4" />
        </div>
        <div className="border-t border-white/10 p-4 text-gray-300 [&_p]:text-gray-200 [&_span]:text-gray-400">
          <LocationIndicator />
        </div>
      </div>
    </div>
  );
}
