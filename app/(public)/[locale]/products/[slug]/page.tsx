import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { Link } from '@/i18n/navigation';
import { getPublicProductBySlug } from '@/lib/actions/public-products';
import { buildOgImageUrl, createPublicMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/config';

type ProductDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export const revalidate = 900;

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const currentLocale: Locale = locale === 'ar' ? 'ar' : 'en';
  const product = await getPublicProductBySlug(currentLocale, slug);

  if (!product) {
    return createPublicMetadata({
      locale: currentLocale,
      pathname: `/products/${slug}`,
      title: 'Product not found',
      description: 'The requested product could not be found.',
    });
  }

  const title = product.name;
  const description = product.shortDescription || product.fullDescription || 'Explore product details from Damira Pharma.';

  return createPublicMetadata({
    locale: currentLocale,
    pathname: `/products/${slug}`,
    title,
    description,
    image: product.coverImageUrl || buildOgImageUrl(title, currentLocale),
    type: 'article',
  });
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, slug } = await params;
  const currentLocale: Locale = locale === 'ar' ? 'ar' : 'en';
  const t = await getTranslations({ locale: currentLocale, namespace: 'productDetailPage' });
  const tProducts = await getTranslations({ locale: currentLocale, namespace: 'products' });

  const product = await getPublicProductBySlug(currentLocale, slug);

  if (!product) {
    notFound();
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.fullDescription || undefined,
    image: product.coverImageUrl || undefined,
    category: product.category?.name || undefined,
    brand: {
      '@type': 'Organization',
      name: 'Damira Pharma',
    },
    manufacturer: product.manufacturer
      ? {
          '@type': 'Organization',
          name: product.manufacturer.name,
        }
      : undefined,
    additionalProperty: [
      product.therapeuticArea
        ? {
            '@type': 'PropertyValue',
            name: t('therapeuticArea'),
            value: product.therapeuticArea.name,
          }
        : null,
      {
        '@type': 'PropertyValue',
        name: t('status'),
        value: product.status === 'AVAILABLE' ? tProducts('available') : tProducts('pipeline'),
      },
    ].filter(Boolean),
  };

  return (
    <div className="relative overflow-hidden pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_12%_10%,_hsl(var(--color-primary)/0.2),_transparent_55%),radial-gradient(circle_at_88%_18%,_hsl(var(--color-accent)/0.14),_transparent_50%)]" />

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-8 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pt-16">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{t('details')}</p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">{product.name}</h1>
          {product.shortDescription ? <p className="text-base text-muted-foreground sm:text-lg">{product.shortDescription}</p> : null}

          <dl className="grid gap-3 rounded-3xl border border-border/80 bg-card/95 p-5 text-sm shadow-[var(--shadow-card)] sm:grid-cols-2">
            <InfoItem label={t('category')} value={product.category?.name || '-'} />
            <InfoItem label={t('therapeuticArea')} value={product.therapeuticArea?.name || '-'} />
            <InfoItem label={t('manufacturer')} value={product.manufacturer?.name || '-'} />
            <InfoItem
              label={t('status')}
              value={product.status === 'AVAILABLE' ? tProducts('available') : tProducts('pipeline')}
            />
          </dl>

          {product.fullDescription ? (
            <article className="rounded-3xl border border-border/80 bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="prose max-w-none text-foreground/90" dangerouslySetInnerHTML={{ __html: product.fullDescription }} />
            </article>
          ) : null}

          {product.advancedDetails?.storageConditions || product.advancedDetails?.regulatoryInfo ? (
            <section className="rounded-3xl border border-border/80 bg-card p-5 shadow-[var(--shadow-card)]">
              {product.advancedDetails.storageConditions ? (
                <p className="text-sm text-foreground">
                  <span className="font-semibold">{t('storageConditions')}:</span> {product.advancedDetails.storageConditions}
                </p>
              ) : null}
              {product.advancedDetails.regulatoryInfo ? (
                <div className="mt-3 text-sm text-foreground">
                  <p className="font-semibold">{t('regulatoryInfo')}</p>
                  <div
                    className="prose mt-1 max-w-none text-foreground/90"
                    dangerouslySetInnerHTML={{ __html: product.advancedDetails.regulatoryInfo }}
                  />
                </div>
              ) : null}
            </section>
          ) : null}

          {product.attachments.length > 0 ? (
            <section className="rounded-3xl border border-border/80 bg-card p-5 shadow-[var(--shadow-card)]">
              <h2 className="text-lg font-semibold text-foreground">{t('attachments')}</h2>
              <ul className="mt-3 space-y-2">
                {product.attachments.map((attachment) => (
                  <li key={attachment.id}>
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
                    >
                      {t('download')}: {attachment.name}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="rounded-3xl border border-border/80 bg-card p-4 shadow-[var(--shadow-card)] sm:p-5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
            {product.coverImageUrl ? (
              <Image
                src={product.coverImageUrl}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--color-primary)/0.35),transparent_55%),radial-gradient(circle_at_80%_70%,hsl(var(--color-secondary)/0.25),transparent_50%)]" />
            )}
          </div>

          {product.relatedProducts.length > 0 ? (
            <div className="mt-5">
              <h2 className="text-lg font-semibold text-foreground">{t('relatedProducts')}</h2>
              <div className="mt-3 space-y-2">
                {product.relatedProducts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/products/${related.slug}`}
                    className="block rounded-2xl border border-border/80 bg-background px-4 py-3 text-sm transition hover:border-primary/35 hover:bg-primary/5"
                  >
                    <p className="font-semibold text-foreground">{related.name}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{related.shortDescription || '-'}</p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </aside>
      </section>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
