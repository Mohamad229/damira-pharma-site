'use client';

import { useLocale } from 'next-intl';

import { Link, usePathname } from '@/i18n/navigation';
import { localeNames, locales, type Locale } from '@/i18n/config';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-border bg-background p-1"
      role="group"
      aria-label="Language switcher"
    >
      {locales.map((nextLocale) => {
        const isActive = locale === nextLocale;

        return (
          <Link
            key={nextLocale}
            href={pathname}
            locale={nextLocale}
            className={[
              'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            ].join(' ')}
            aria-current={isActive ? 'true' : undefined}
          >
            {nextLocale.toUpperCase()} · {localeNames[nextLocale]}
          </Link>
        );
      })}
    </div>
  );
}
