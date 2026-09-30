import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ar from './ar.json';
import fa from './fa.json';
import ps from './ps.json';

export const RTL_LANGUAGES = ['ar', 'fa', 'ps'];

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      fa: { translation: fa },
      ps: { translation: ps },
    },
    lng: localStorage.getItem('academy_lang') || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export function setAppLanguage(lang) {
  i18n.changeLanguage(lang);
  localStorage.setItem('academy_lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = RTL_LANGUAGES.includes(lang) ? 'rtl' : 'ltr';
}

// Set initial direction on load
setAppLanguage(i18n.language);

export default i18n;
