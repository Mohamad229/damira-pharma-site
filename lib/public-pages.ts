import { SectionType } from '@prisma/client';

import db from '@/lib/db';
import { defaultLocale, type Locale } from '@/i18n/config';

type JsonRecord = Record<string, unknown>;

export interface PublicPageSection {
  id: string;
  type: SectionType;
  order: number;
  content: JsonRecord;
}

export interface PublicPageData {
  slug: string;
  title: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  sections: PublicPageSection[];
}

export interface PublicPageSeo {
  slug: string;
  title: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
}

export async function getPublishedPageBySlug(
  slug: string,
  locale: Locale
): Promise<PublicPageData | null> {
  const page = await db.page.findFirst({
    where: {
      slug,
      isPublished: true,
    },
    include: {
      translations: true,
      sections: {
        orderBy: { order: 'asc' },
        include: {
          translations: true,
        },
      },
    },
  });

  if (!page) {
    return null;
  }

  const pageTranslation =
    page.translations.find((translation) => translation.locale === locale) ||
    page.translations.find((translation) => translation.locale === defaultLocale) ||
    page.translations[0];

  const sections: PublicPageSection[] = page.sections.map((section) => {
    const localeTranslation =
      section.translations.find((translation) => translation.locale === locale) ||
      section.translations.find((translation) => translation.locale === defaultLocale) ||
      section.translations[0];

    const data = isJsonRecord(section.data) ? section.data : {};
    const translatedContent = isJsonRecord(localeTranslation?.content) ? localeTranslation.content : {};

    return {
      id: section.id,
      type: section.type,
      order: section.order,
      content: {
        ...data,
        ...translatedContent,
      },
    };
  });

  return {
    slug: page.slug,
    title: pageTranslation?.title || page.slug,
    metaTitle: pageTranslation?.metaTitle,
    metaDescription: pageTranslation?.metaDescription,
    sections,
  };
}

export async function getPublishedPageSeoBySlug(
  slug: string,
  locale: Locale
): Promise<PublicPageSeo | null> {
  const page = await db.page.findFirst({
    where: {
      slug,
      isPublished: true,
    },
    include: {
      translations: true,
    },
  });

  if (!page) {
    return null;
  }

  const pageTranslation =
    page.translations.find((translation) => translation.locale === locale) ||
    page.translations.find((translation) => translation.locale === defaultLocale) ||
    page.translations[0];

  return {
    slug: page.slug,
    title: pageTranslation?.title || page.slug,
    metaTitle: pageTranslation?.metaTitle,
    metaDescription: pageTranslation?.metaDescription,
  };
}

export async function getPublishedPageSlugs() {
  const pages = await db.page.findMany({
    where: {
      isPublished: true,
    },
    select: {
      slug: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return pages;
}

function isJsonRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
