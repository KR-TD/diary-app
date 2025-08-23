"use client"

import React, { useState, useEffect } from "react"
import { I18nextProvider } from "react-i18next"
import i18n from "../lib/i18n"
import { ThemeProvider } from "../components/theme-provider"

export function Providers({ children, initialLocale }: { children: React.ReactNode, initialLocale: string }) {
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    if (i18n.isInitialized) {
      setI18nReady(true);
    } else {
      i18n.on('initialized', () => setI18nReady(true));
    }

    if (i18n.language !== initialLocale) {
      i18n.changeLanguage(initialLocale);
    }

    return () => {
      i18n.off('initialized', () => setI18nReady(true));
    };
  }, [initialLocale]);

  if (!i18nReady) {
    return null; // Or a loading spinner if desired
  }

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
      >
        {children}
      </ThemeProvider>
    </I18nextProvider>
  )
}