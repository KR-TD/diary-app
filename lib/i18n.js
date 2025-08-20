import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ko', // Fallback language
    debug: true, // Enable debug mode for development
    detection: {
      order: ['localStorage', 'navigator'], // Order of language detection
      caches: ['localStorage'], // Cache detected language in localStorage
    },
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Path to load translations
    },
    react: {
      useSuspense: false, // Disable suspense for now
    },
    supportedLngs: ['ko', 'en', 'ja', 'zh'], // Supported languages
    ns: ['translation'], // Namespace for translations
    defaultNS: 'translation', // Default namespace
  });

export default i18n;