import type { Metadata } from 'next';
import { ArrowRight, ChartNoAxesCombined, Handshake, ShieldCheck } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { PublicInquiryForm } from '@/components/public/forms/public-inquiry-form';
import type { Locale } from '@/i18n/config';
import { buildOgImageUrl, createPublicMetadata } from '@/lib/seo';

type PartnershipsPageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 900;

export async function generateMetadata({ params }: PartnershipsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale: Locale = locale === 'ar' ? 'ar' : 'en';
  const t = await getTranslations({ locale: currentLocale, namespace: 'partnershipsPage' });
  const title = t('title');

  return createPublicMetadata({
    locale: currentLocale,
    pathname: '/partnerships',
    title,
    description: t('subtitle'),
    image: buildOgImageUrl(title, currentLocale),
  });
}

export default async function PartnershipsPage({ params }: PartnershipsPageProps) {
  const { locale } = await params;
  const currentLocale: 'en' | 'ar' = locale === 'ar' ? 'ar' : 'en';
  const t = await getTranslations('partnershipsPage');

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[460px] bg-[radial-gradient(circle_at_20%_10%,_hsl(var(--color-secondary)/0.2),_transparent_55%),radial-gradient(circle_at_80%_20%,_hsl(var(--color-primary)/0.18),_transparent_50%)]" />

      <section className="mx-auto w-full max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:px-8 lg:pb-10 lg:pt-16">
        <p className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-secondary-dark">
          <Handshake className="h-3.5 w-3.5" />
          {t('kicker')}
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">{t('subtitle')}</p>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
        <div className="space-y-4 rounded-[2rem] border border-border/70 bg-card/95 p-6 shadow-[var(--shadow-card)] sm:p-7">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{t('whyPartnerTitle')}</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/40 p-3">
              <ChartNoAxesCombined className="mt-0.5 h-4 w-4 text-primary" />
              <span>{t('benefitA')}</span>
            </li>
            <li className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/40 p-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" />
              <span>{t('benefitB')}</span>
            </li>
            <li className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/40 p-3">
              <ArrowRight className="mt-0.5 h-4 w-4 text-primary" />
              <span>{t('benefitC')}</span>
            </li>
          </ul>
          <p className="rounded-2xl border border-accent/30 bg-accent/10 p-4 text-sm text-foreground">
            {t('callout')}
          </p>
        </div>

        <div className="rounded-[2rem] border border-border/70 bg-card p-6 shadow-[var(--shadow-card)] sm:p-7">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{t('formTitle')}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t('formDescription')}</p>

          <div className="mt-6">
            <PublicInquiryForm
              locale={currentLocale}
              type="PARTNERSHIP"
              labels={{
                fullName: t('fields.fullName'),
                email: t('fields.email'),
                phone: t('fields.phone'),
                company: t('fields.company'),
                inquiryType: t('fields.inquiryType'),
                inquiryTypePlaceholder: t('fields.inquiryTypePlaceholder'),
                message: t('fields.message'),
                submit: t('fields.submit'),
                submitting: t('fields.submitting'),
                privacyNote: t('fields.privacyNote'),
                genericError: t('feedback.genericError'),
                successTitle: t('feedback.successTitle'),
                errorTitle: t('feedback.errorTitle'),
              }}
              inquiryTypeOptions={getPartnershipInquiryOptions(currentLocale)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function getPartnershipInquiryOptions(locale: Locale) {
  if (locale === 'ar') {
    return [
      { value: 'distribution', label: 'شراكة توزيع' },
      { value: 'licensing', label: 'ترخيص' },
      { value: 'strategic', label: 'تحالف استراتيجي' },
      { value: 'investment', label: 'استثمار' },
      { value: 'other', label: 'أخرى' },
    ];
  }

  return [
    { value: 'distribution', label: 'Distribution Partnership' },
    { value: 'licensing', label: 'Licensing' },
    { value: 'strategic', label: 'Strategic Alliance' },
    { value: 'investment', label: 'Investment' },
    { value: 'other', label: 'Other' },
  ];
}
