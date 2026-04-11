import type { Metadata } from 'next';

import { PublicPageContent } from '@/components/public/page-content';
import { getFallbackPublicPageSeo } from '@/lib/public-page-fallbacks';
import { getPublishedPageSeoBySlug } from '@/lib/public-pages';
import { buildOgImageUrl, createPublicMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/config';

type CompliancePageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 900;

export async function generateMetadata({ params }: CompliancePageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale: Locale = locale === 'ar' ? 'ar' : 'en';
  const seo =
    (await getPublishedPageSeoBySlug('compliance', currentLocale)) ||
    getFallbackPublicPageSeo('compliance', currentLocale);

  const title = seo?.metaTitle || seo?.title || 'Quality and Compliance | Damira Pharma';
  const description =
    seo?.metaDescription || 'Review Damira Pharma quality, ethics, and compliance practices for resilient healthcare delivery.';

  return createPublicMetadata({
    locale: currentLocale,
    pathname: '/compliance',
    title,
    description,
    image: buildOgImageUrl(title, currentLocale),
  });
}

export default async function CompliancePage({ params }: CompliancePageProps) {
  const { locale } = await params;
  const currentLocale: Locale = locale === 'ar' ? 'ar' : 'en';

  return <PublicPageContent slug="compliance" locale={currentLocale} />;
}
