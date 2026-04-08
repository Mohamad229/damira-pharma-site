import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, localeDirection, type Locale } from '@/i18n/config';
import { fontVariables } from '@/lib/fonts';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function PublicLayout({ children, params }: Props) {
  const { locale } = await params;
  
  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the locale
  const messages = await getMessages();
  const direction = localeDirection[locale as Locale];

  return (
    <html lang={locale} dir={direction} className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen flex flex-col">
            <header className="border-b">
              {/* Header placeholder */}
            </header>
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t">
              {/* Footer placeholder */}
            </footer>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
