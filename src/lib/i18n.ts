import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fa from '../locales/fa.json';
import en from '../locales/en.json';

// گرفتن زبان ذخیره شده یا پیش‌فرض فارسی
const savedLanguage = localStorage.getItem('sherpider_language') || 'fa';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fa: { translation: fa },
      en: { translation: en }
    },
    lng: savedLanguage,
    fallbackLng: 'fa',
    interpolation: { escapeValue: false }
  });

export default i18n;