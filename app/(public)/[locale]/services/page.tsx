import type { Metadata } from 'next';

import { PublicPageContent } from '@/components/public/page-content';
import { getFallbackPublicPageSeo } from '@/lib/public-page-fallbacks';
import { getPublishedPageSeoBySlug } from '@/lib/public-pages';
import { buildOgImageUrl, createPublicMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/config';

type ServicesPageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 900;

export async function generateMetadata({ params }: ServicesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale: Locale = locale === 'ar' ? 'ar' : 'en';
  const seo =
    (await getPublishedPageSeoBySlug('services', currentLocale)) ||
    getFallbackPublicPageSeo('services', currentLocale);

  const title = seo?.metaTitle || seo?.title || 'Damira Pharma Services';
  const description = seo?.metaDescription || 'Integrated pharmaceutical services across regulatory, supply, and growth.';

  return createPublicMetadata({
    locale: currentLocale,
    pathname: '/services',
    title,
    description,
    image: buildOgImageUrl(title, currentLocale),
  });
}

export default async function ServicesPage({ params }: ServicesPageProps) {
  const { locale } = await params;
  const currentLocale: Locale = locale === 'ar' ? 'ar' : 'en';

  return <PublicPageContent slug="services" locale={currentLocale} />;
}
