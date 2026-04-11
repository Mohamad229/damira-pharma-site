import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';

import { LanguageSwitcher } from './language-switcher';

type NavItem = {
  href: string;
  label: string;
};

export async function SiteHeader() {
  const t = await getTranslations('common');

  const navItems: NavItem[] = [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') },
    { href: '/services', label: t('services') },
    { href: '/products', label: t('products') },
    { href: '/compliance', label: t('compliance') },
    { href: '/partnerships', label: t('partnerships') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight text-primary">
          Damira Pharma
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          <nav aria-label="Main navigation" className="flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher />
        </div>
      </div>

      <div className="border-t border-border/70 lg:hidden">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <nav aria-label="Mobile navigation" className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
