import { getLocale, getTranslations } from 'next-intl/server';

import { localeDirection, type Locale } from '@/i18n/config';
import { Link } from '@/i18n/navigation';

export async function SiteFooter() {
  const tCommon = await getTranslations('common');
  const tFooter = await getTranslations('footer');
  const locale = (await getLocale()) as Locale;
  const currentYear = new Date().getFullYear();
  const direction = localeDirection[locale];

  const footerLinks = [
    { href: '/', label: tCommon('home') },
    { href: '/products', label: tCommon('products') },
    { href: '/contact', label: tCommon('contact') },
  ];

  return (
    <footer className="border-t border-border/80 bg-muted/30">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            <span dir={direction}>{currentYear}</span> Damira Pharma. {tFooter('rights')}.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {footerLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
