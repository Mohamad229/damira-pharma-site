import { notFound } from 'next/navigation';

import { DynamicSectionRenderer } from '@/components/public/section-renderer';
import { getFallbackPublicPage } from '@/lib/public-page-fallbacks';
import { getPublishedPageBySlug } from '@/lib/public-pages';
import type { Locale } from '@/i18n/config';

interface PublicPageContentProps {
  slug: string;
  locale: Locale;
}

export async function PublicPageContent({ slug, locale }: PublicPageContentProps) {
  const normalizedSlug = slug === '/' || slug === '' ? 'home' : slug;
  const page = (await getPublishedPageBySlug(normalizedSlug, locale)) || getFallbackPublicPage(normalizedSlug, locale);

  if (!page) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <DynamicSectionRenderer sections={page.sections} />
    </div>
  );
}
