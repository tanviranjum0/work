import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from './locales/en/common.json';

/**
 * English ships in the bundle. Bangla, Arabic and French are planned; they will
 * load on demand, and Arabic will flip `dir` to rtl on <html>.
 */
export const SUPPORTED_LOCALES = ['en'] as const;
export const RTL_LOCALES = new Set<string>(['ar']);

void i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  resources: { en: { common: enCommon } },
  interpolation: { escapeValue: false }, // React already escapes output
  returnNull: false,
});

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = RTL_LOCALES.has(lng) ? 'rtl' : 'ltr';
});

export default i18n;
