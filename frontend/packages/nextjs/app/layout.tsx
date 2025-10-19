import { ReactNode } from 'react';
// import { dir } from 'i18next'; // Removed as not used
import { languages } from '../i18n/settings';
import { useTranslation } from '../i18n';
import TranslationsProvider from '~~/components/TranslationsProvider';
import { DappWrapperWithProviders } from "~~/components/DappWrapperWithProviders";
import { ThemeProvider } from "next-themes"; // Revert to original import
import { getMetadata } from '~~/utils/helper/getMetadata';
import "~~/styles/globals.css";

// generateStaticParams removed as [locale] dynamic segment is removed

export const metadata = getMetadata({
  title: "Golden Ticket DApp",
  description: "A DApp for verifying asset ownership and minting a Golden Ticket NFT using FHE.",
});

const i18nNamespaces = ['common'];

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = 'en'; // Hardcoded as [locale] dynamic segment is removed
  const { resources } = await useTranslation(locale, i18nNamespaces);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-black text-white">
        <TranslationsProvider
          namespaces={i18nNamespaces}
          locale={locale}
          resources={resources}
        >
          <DappWrapperWithProviders>
            {children}
          </DappWrapperWithProviders>
        </TranslationsProvider>
      </body>
    </html>
  );
}



