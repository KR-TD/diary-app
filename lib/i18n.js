import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations directly
import translationEN from '../public/locales/en/translation.json';
import translationKO from '../public/locales/ko/translation.json';
import translationJA from '../public/locales/ja/translation.json';
import translationZH from '../public/locales/zh/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  ko: {
    translation: translationKO,
  },
  ja: {
    translation: translationJA,
  },
  zh: {
    translation: translationZH,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ko', // Fallback language
    debug: true, // Enable debug mode for development
    detection: {
      order: ['localStorage', 'navigator'], // Order of language detection
      caches: ['localStorage'], // Cache detected language in localStorage
    },
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    react: {
      useSuspense: false, // Disable suspense for now
    },
    supportedLngs: ['ko', 'en', 'ja', 'zh'], // Supported languages
    ns: ['translation'], // Namespace for translations
    defaultNS: 'translation', // Default namespace
  });

export default i18n;
