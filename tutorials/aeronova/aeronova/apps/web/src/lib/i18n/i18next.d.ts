import 'i18next';
import type common from './locales/en/common.json';

// Makes t('some.key') a compile error when the key doesn't exist.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: { common: typeof common };
  }
}
