import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { CatalogControls } from '@/components/public/products/catalog-controls';
import { ProductCard } from '@/components/public/products/product-card';
import { ProductPagination } from '@/components/public/products/product-pagination';
import { getPublicProducts } from '@/lib/actions/public-products';
import { buildOgImageUrl, createPublicMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/config';

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const revalidate = 900;

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale: Locale = locale === 'ar' ? 'ar' : 'en';
  const t = await getTranslations({ locale: currentLocale, namespace: 'productsPage' });
  const title = t('title');

  return createPublicMetadata({
    locale: currentLocale,
    pathname: '/products',
    title,
    description: t('subtitle'),
    image: buildOgImageUrl(title, currentLocale),
  });
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
  const { locale } = await params;
  const currentLocale: Locale = locale === 'ar' ? 'ar' : 'en';
  const query = await searchParams;
  const tProducts = await getTranslations({ locale: currentLocale, namespace: 'products' });
  const tPage = await getTranslations({ locale: currentLocale, namespace: 'productsPage' });

  const search = toSingleValue(query.search);
  const category = toSingleValue(query.category);
  const therapeuticArea = toSingleValue(query.therapeuticArea);
  const statusRaw = toSingleValue(query.status);
  const pageRaw = Number(toSingleValue(query.page) || '1');
  const viewRaw = toSingleValue(query.view);

  const status = statusRaw === 'AVAILABLE' || statusRaw === 'PIPELINE' ? statusRaw : undefined;
  const view: 'grid' | 'list' = viewRaw === 'list' ? 'list' : 'grid';

  const data = await getPublicProducts(currentLocale, {
    page: Number.isNaN(pageRaw) ? 1 : pageRaw,
    search,
    categoryId: category,
    therapeuticAreaId: therapeuticArea,
    status,
  });

  return (
    <div className="relative overflow-hidden pb-16">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[460px] bg-[radial-gradient(circle_at_15%_8%,_hsl(var(--color-primary)/0.2),_transparent_58%),radial-gradient(circle_at_82%_15%,_hsl(var(--color-secondary)/0.16),_transparent_55%)]" />

      <section className="mx-auto w-full max-w-7xl px-4 pb-6 pt-12 sm:px-6 lg:px-8">
        <p className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {tPage('kicker')}
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
          {tPage('title')}
        </h1>
        <p className="mt-4 max-w-3xl text-base text-muted-foreground sm:text-lg">{tPage('subtitle')}</p>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <CatalogControls
          initialSearch={search || ''}
          initialCategoryId={category || ''}
          initialTherapeuticAreaId={therapeuticArea || ''}
          initialStatus={status || ''}
          initialView={view}
          categories={data.categories}
          therapeuticAreas={data.therapeuticAreas}
          labels={{
            searchPlaceholder: tPage('searchPlaceholder'),
            category: tProducts('category'),
            therapeuticArea: tProducts('therapeuticArea'),
            status: tPage('status'),
            allCategories: tPage('allCategories'),
            allAreas: tPage('allAreas'),
            allStatuses: tPage('allStatuses'),
            available: tProducts('available'),
            pipeline: tProducts('pipeline'),
            apply: tPage('apply'),
            reset: tPage('reset'),
            filters: tPage('filters'),
            gridView: tPage('gridView'),
            listView: tPage('listView'),
          }}
        />
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pt-7 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-muted-foreground">
          {data.total} {tPage('results')} - {tPage('page')} {data.page}/{data.totalPages}
        </p>

        {data.items.length > 0 ? (
          <div className={view === 'grid' ? 'mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3' : 'mt-4 space-y-4'}>
            {data.items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={currentLocale}
                view={view}
                labels={{
                  details: tProducts('details'),
                  available: tProducts('available'),
                  pipeline: tProducts('pipeline'),
                  category: tProducts('category'),
                  therapeuticArea: tProducts('therapeuticArea'),
                }}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-border/80 bg-card p-8 text-center shadow-[var(--shadow-card)]">
            <h2 className="text-xl font-semibold text-foreground">{tPage('emptyTitle')}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{tPage('emptyDescription')}</p>
          </div>
        )}

        <ProductPagination
          page={data.page}
          totalPages={data.totalPages}
          pathname="/products"
          searchParams={{
            search,
            category,
            therapeuticArea,
            status,
            view,
          }}
          labels={{
            previous: tPage('previous'),
            next: tPage('next'),
            page: tPage('page'),
          }}
        />
      </section>
    </div>
  );
}

function toSingleValue(value: string | string[] | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  return Array.isArray(value) ? value[0] : value;
}
