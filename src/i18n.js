// import i18n from 'i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';
// import Backend from 'i18next-http-backend';
// import { initReactI18next } from 'react-i18next';
// import { getDefaultLanguage } from './utils/language-local.util';
// import { getRemoteAssetsUrl } from './helpers/common.helpers';

// i18n
//   // detect user language
//   // learn more: https://github.com/i18next/i18next-browser-languageDetector
//   .use(LanguageDetector)
//   // load translation using http -> see /public/locales
//   // learn more: https://github.com/i18next/i18next-http-backend
//   .use(Backend)
//   // passes i18n down to react-i18next
//   .use(initReactI18next)
//   // init i18next
//   // for all options read: https://www.i18next.com/overview/configuration-options
//   .init({
//     lng: getDefaultLanguage()?.code ?? 'fr',
//     fallbackLng: getDefaultLanguage()?.code ?? 'fr',
//     backend: {
//       loadPath: getRemoteAssetsUrl('/locales/{{lng}}.json', 'locales/{{lng}}.json'),
//     },
//     interpolation: {
//       escapeValue: false, // react already safes from xss
//     },
//     debug: false,
//   })
//   .catch((err) => {
//     console.debug(err);
//     throw new Error('Error occurred while initialize i18n');
//   });

// export default i18n;
