'use client';

import { useLocale } from 'next-intl';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Package2 } from 'lucide-react';
import Link from 'next/link';
import { NavLinks } from './nav-links';
import { LocationIndicator } from './LocationIndicator';
import { useState } from 'react';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 md:hidden border-white/10 bg-white/5 hover:bg-white/10"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col border-white/10 safe-area-top" style={{ backgroundColor: '#0c0c14', color: '#e5e5e5' }}>
        <nav className="grid gap-1 text-lg font-medium">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5 text-lg font-semibold mb-6"
          >
            <Package2 className="h-6 w-6 text-orange-500" />
            <span className="text-white text-xl font-jakarta tracking-tight">FoodTracks</span>
          </Link>
          <NavLinks />
        </nav>
        <div className="mt-auto border-t border-white/8 pt-4">
          <LocationIndicator />
        </div>
      </SheetContent>
    </Sheet>
  );
}
