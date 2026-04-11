import type { Metadata } from 'next';
import { Building2, Clock3, Mail, MapPin, PhoneCall, Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { PublicInquiryForm } from '@/components/public/forms/public-inquiry-form';
import type { Locale } from '@/i18n/config';
import { buildOgImageUrl, createPublicMetadata } from '@/lib/seo';

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 900;

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale: Locale = locale === 'ar' ? 'ar' : 'en';
  const t = await getTranslations({ locale: currentLocale, namespace: 'contactPage' });
  const title = t('title');

  return createPublicMetadata({
    locale: currentLocale,
    pathname: '/contact',
    title,
    description: t('subtitle'),
    image: buildOgImageUrl(title, currentLocale),
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const currentLocale: 'en' | 'ar' = locale === 'ar' ? 'ar' : 'en';
  const t = await getTranslations('contactPage');

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-[radial-gradient(circle_at_top,_hsl(var(--color-primary)/0.18),_transparent_65%),linear-gradient(145deg,_hsl(var(--color-secondary)/0.05),_hsl(var(--color-accent)/0.08))]" />

      <section className="mx-auto w-full max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:px-8 lg:pb-12 lg:pt-16">
        <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          {t('kicker')}
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">{t('subtitle')}</p>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <aside className="space-y-4 rounded-[2rem] border border-border/70 bg-card/95 p-6 shadow-[var(--shadow-card)] sm:p-7">
          <h2 className="text-lg font-semibold text-foreground">{t('contactInfoTitle')}</h2>
          <p className="text-sm text-muted-foreground">{t('contactInfoDescription')}</p>

          <ul className="space-y-3 text-sm text-foreground">
            <li className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/40 p-3">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="font-semibold">{t('addressLabel')}</p>
                <p className="text-muted-foreground">{t('addressValue')}</p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/40 p-3">
              <PhoneCall className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="font-semibold">{t('phoneLabel')}</p>
                <p className="text-muted-foreground">+20 2 2390 2200</p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/40 p-3">
              <Mail className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="font-semibold">{t('emailLabel')}</p>
                <p className="text-muted-foreground">info@damirapharma.com</p>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/40 p-3">
              <Clock3 className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="font-semibold">{t('hoursLabel')}</p>
                <p className="text-muted-foreground">{t('hoursValue')}</p>
              </div>
            </li>
          </ul>

          <div className="rounded-2xl border border-secondary/20 bg-secondary/10 p-4 text-sm text-secondary-dark">
            <p className="inline-flex items-center gap-2 font-semibold">
              <Building2 className="h-4 w-4" />
              {t('regionalOfficeTitle')}
            </p>
            <p className="mt-1 text-secondary-dark/90">{t('regionalOfficeDescription')}</p>
          </div>
        </aside>

        <div className="rounded-[2rem] border border-border/70 bg-card p-6 shadow-[var(--shadow-card)] sm:p-7">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{t('formTitle')}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t('formDescription')}</p>

          <div className="mt-6">
            <PublicInquiryForm
              locale={currentLocale}
              type="CONTACT"
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
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border/70 bg-card p-5 shadow-[var(--shadow-card)] sm:p-6">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{t('mapTitle')}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t('mapDescription')}</p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-border/70">
            <iframe
              title={t('mapTitle')}
              src="https://maps.google.com/maps?q=cairo%20egypt&t=&z=12&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              className="h-72 w-full border-0"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border/70 bg-gradient-to-br from-card to-muted/40 p-6 shadow-[var(--shadow-card)] sm:p-7">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{t('productInquiryTitle')}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t('productInquiryDescription')}</p>

          <div className="mt-6">
            <PublicInquiryForm
              locale={currentLocale}
              type="PRODUCT_INQUIRY"
              labels={{
                fullName: t('fields.fullName'),
                email: t('fields.email'),
                phone: t('fields.phone'),
                company: t('fields.company'),
                inquiryType: t('fields.inquiryType'),
                inquiryTypePlaceholder: t('fields.inquiryTypePlaceholder'),
                message: t('fields.message'),
                submit: t('fields.submitProduct'),
                submitting: t('fields.submitting'),
                privacyNote: t('fields.privacyNote'),
                genericError: t('feedback.genericError'),
                successTitle: t('feedback.successTitle'),
                errorTitle: t('feedback.errorTitle'),
              }}
              inquiryTypeOptions={getProductInquiryOptions(currentLocale)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function getProductInquiryOptions(locale: Locale) {
  if (locale === 'ar') {
    return [
      { value: 'availability', label: 'التوافر' },
      { value: 'pricing', label: 'الأسعار' },
      { value: 'technical', label: 'معلومات فنية' },
      { value: 'regulatory', label: 'استفسار تنظيمي' },
      { value: 'other', label: 'أخرى' },
    ];
  }

  return [
    { value: 'availability', label: 'Availability' },
    { value: 'pricing', label: 'Pricing' },
    { value: 'technical', label: 'Technical Information' },
    { value: 'regulatory', label: 'Regulatory Question' },
    { value: 'other', label: 'Other' },
  ];
}
