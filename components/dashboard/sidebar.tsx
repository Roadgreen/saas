import Link from 'next/link';
import { NavLinks } from './nav-links';
import { Package2 } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';

export function Sidebar() {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center justify-between border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">SnapTrack</span>
          </Link>
          <LanguageSwitcher />
        </div>
        <div className="flex-1">
          <NavLinks className="px-2 lg:px-4" />
        </div>
      </div>
    </div>
  );
}
