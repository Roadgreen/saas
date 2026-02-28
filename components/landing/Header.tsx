'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { LanguageSwitcher } from "@/components/language-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';
import { ChefHat, Menu, X, LayoutDashboard, Settings, LogOut } from "lucide-react";

export function LandingHeader() {
  const t = useTranslations('Landing');
  const locale = useLocale();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userInitials = session?.user?.name
    ? session.user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : session?.user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: '#1C1410', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="container mx-auto px-5 sm:px-8 lg:px-14 py-4 flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <ChefHat className="h-8 w-8" style={{ color: '#fb923c' }} />
          <span className="text-2xl font-bold" style={{ color: '#ffffff' }}>FoodTracks</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href={`/${locale}#fonctionnalites`} className="nav-link-hover text-sm font-medium transition-colors" style={{ color: '#9ca3af' }}>
            {t('nav.features')}
          </Link>
          <Link href={`/${locale}#comment-ca-marche`} className="nav-link-hover text-sm font-medium transition-colors" style={{ color: '#9ca3af' }}>
            {t('nav.howItWorks')}
          </Link>
          <Link href={`/${locale}/pricing`} className="nav-link-hover text-sm font-medium transition-colors" style={{ color: '#9ca3af' }}>
            {t('nav.pricing')}
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          {session?.user ? (
            /* ── Avatar + dropdown ── */
            <div ref={dropdownRef} className="relative hidden md:block">
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full p-0.5 transition-opacity hover:opacity-80"
                aria-label="Account menu"
              >
                <Avatar className="size-8 border-2" style={{ borderColor: '#fb923c' }}>
                  <AvatarImage src={session.user.image ?? undefined} />
                  <AvatarFallback className="text-xs font-semibold" style={{ backgroundColor: 'rgba(249,115,22,0.2)', color: '#fb923c' }}>
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 rounded-xl shadow-xl py-1 z-50"
                  style={{ backgroundColor: '#1C1410', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {/* User info */}
                  <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <p className="text-sm font-medium truncate" style={{ color: '#ffffff' }}>
                      {session.user.name ?? session.user.email}
                    </p>
                    {session.user.name && (
                      <p className="text-xs truncate mt-0.5" style={{ color: '#6b7280' }}>
                        {session.user.email}
                      </p>
                    )}
                  </div>
                  {/* Links */}
                  <Link
                    href={`/${locale}/dashboard`}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:opacity-80"
                    style={{ color: '#d1d5db' }}
                  >
                    <LayoutDashboard className="h-4 w-4" style={{ color: '#fb923c' }} />
                    {t('userMenu.dashboard')}
                  </Link>
                  <Link
                    href={`/${locale}/dashboard/settings`}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:opacity-80"
                    style={{ color: '#d1d5db' }}
                  >
                    <Settings className="h-4 w-4" style={{ color: '#9ca3af' }} />
                    {t('userMenu.settings')}
                  </Link>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} className="mt-1 pt-1">
                    <button
                      onClick={() => signOut({ callbackUrl: `/${locale}` })}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left transition-colors hover:opacity-80"
                      style={{ color: '#f87171' }}
                    >
                      <LogOut className="h-4 w-4" />
                      {t('userMenu.signOut')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link href={`/${locale}/login`}>
                <button className="btn-landing btn-header inline-flex items-center justify-center rounded-md text-sm font-medium px-3 py-1.5 border" style={{ backgroundColor: 'transparent', borderColor: '#4b5563', color: '#d1d5db' }}>
                  {t('login')}
                </button>
              </Link>
              <Link href={`/${locale}/register`}>
                <button className="btn-landing btn-cta-primary inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-1.5" style={{ backgroundColor: '#f97316', color: '#ffffff' }}>
                  {t('freeTrial')}
                </button>
              </Link>
            </div>
          )}

          <button
            className="md:hidden p-2 rounded-md transition-colors"
            style={{ color: '#d1d5db', backgroundColor: 'transparent' }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="md:hidden px-4 py-4 space-y-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#1C1410' }}>
          <nav className="flex flex-col gap-3">
            <Link href={`/${locale}#fonctionnalites`} className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: '#9ca3af' }} onClick={() => setMenuOpen(false)}>
              {t('nav.features')}
            </Link>
            <Link href={`/${locale}#comment-ca-marche`} className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: '#9ca3af' }} onClick={() => setMenuOpen(false)}>
              {t('nav.howItWorks')}
            </Link>
            <Link href={`/${locale}/pricing`} className="text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: '#9ca3af' }} onClick={() => setMenuOpen(false)}>
              {t('nav.pricing')}
            </Link>
          </nav>
          {session?.user ? (
            <div className="space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
              <div className="flex items-center gap-3 pb-3">
                <Avatar className="size-8 border-2" style={{ borderColor: '#fb923c' }}>
                  <AvatarImage src={session.user.image ?? undefined} />
                  <AvatarFallback className="text-xs font-semibold" style={{ backgroundColor: 'rgba(249,115,22,0.2)', color: '#fb923c' }}>
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#ffffff' }}>{session.user.name ?? session.user.email}</p>
                  {session.user.name && <p className="text-xs" style={{ color: '#6b7280' }}>{session.user.email}</p>}
                </div>
              </div>
              <Link href={`/${locale}/dashboard`} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 py-2 text-sm hover:opacity-80" style={{ color: '#d1d5db' }}>
                <LayoutDashboard className="h-4 w-4" style={{ color: '#fb923c' }} />
                {t('userMenu.dashboard')}
              </Link>
              <Link href={`/${locale}/dashboard/settings`} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 py-2 text-sm hover:opacity-80" style={{ color: '#d1d5db' }}>
                <Settings className="h-4 w-4" style={{ color: '#9ca3af' }} />
                {t('userMenu.settings')}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: `/${locale}` })}
                className="flex items-center gap-3 py-2 text-sm w-full text-left hover:opacity-80"
                style={{ color: '#f87171' }}
              >
                <LogOut className="h-4 w-4" />
                {t('userMenu.signOut')}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link href={`/${locale}/register`} className="block">
                <button className="btn-landing btn-cta-primary w-full inline-flex items-center justify-center rounded-md text-sm font-medium px-3 py-2" style={{ backgroundColor: '#f97316', color: '#ffffff' }}>
                  {t('freeTrial')}
                </button>
              </Link>
              <Link href={`/${locale}/login`} className="block">
                <button className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium px-3 py-1.5 border transition-colors" style={{ backgroundColor: 'transparent', borderColor: '#4b5563', color: '#d1d5db' }}>
                  {t('login')}
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
