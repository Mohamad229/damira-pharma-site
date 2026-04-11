import type { Metadata } from 'next';

import { PublicPageContent } from '@/components/public/page-content';
import { getFallbackPublicPageSeo } from '@/lib/public-page-fallbacks';
import { getPublishedPageSeoBySlug } from '@/lib/public-pages';
import { buildOgImageUrl, createPublicMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/config';

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 900;

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale: Locale = locale === 'ar' ? 'ar' : 'en';
  const seo =
    (await getPublishedPageSeoBySlug('about', currentLocale)) || getFallbackPublicPageSeo('about', currentLocale);

  const title = seo?.metaTitle || seo?.title || 'About Damira Pharma';
  const description = seo?.metaDescription || 'Learn about Damira Pharma vision, mission, and values.';

  return createPublicMetadata({
    locale: currentLocale,
    pathname: '/about',
    title,
    description,
    image: buildOgImageUrl(title, currentLocale),
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const currentLocale: Locale = locale === 'ar' ? 'ar' : 'en';

  return <PublicPageContent slug="about" locale={currentLocale} />;
}
