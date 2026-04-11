import type { Metadata } from 'next';

import { PublicPageContent } from '@/components/public/page-content';
import { getFallbackPublicPageSeo } from '@/lib/public-page-fallbacks';
import { getPublishedPageSeoBySlug } from '@/lib/public-pages';
import { buildOgImageUrl, createPublicMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/config';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 900;

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale: Locale = locale === 'ar' ? 'ar' : 'en';
  const seo =
    (await getPublishedPageSeoBySlug('home', currentLocale)) || getFallbackPublicPageSeo('home', currentLocale);

  const title = seo?.metaTitle || seo?.title || 'Damira Pharma';
  const description = seo?.metaDescription || 'Leading pharmaceutical solutions in the Middle East';

  return createPublicMetadata({
    locale: currentLocale,
    pathname: '/',
    title,
    description,
    image: buildOgImageUrl(title, currentLocale),
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const currentLocale: Locale = locale === 'ar' ? 'ar' : 'en';

  return <PublicPageContent slug="home" locale={currentLocale} />;
}
