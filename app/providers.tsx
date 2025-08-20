"use client"

import React from "react"
import { I18nextProvider } from "react-i18next"
import i18n from "../lib/i18n"
import { ThemeProvider } from "../components/theme-provider"

export function Providers({ children, initialLocale }: { children: React.ReactNode, initialLocale: string }) {
  // Initialize i18n with the initialLocale
  React.useEffect(() => {
    if (i18n.language !== initialLocale) {
      i18n.changeLanguage(initialLocale);
    }
  }, [initialLocale]);

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