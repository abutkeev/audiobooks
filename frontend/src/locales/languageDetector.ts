import LanguageDetector, { CustomDetector } from 'i18next-browser-languagedetector';

const customDetector: CustomDetector = {
  name: 'customDetector',
  lookup: () => {
    const language =
      navigator.language ||
      ('userLanguage' in navigator && typeof navigator.userLanguage === 'string' && navigator.userLanguage) ||
      'en';

    return language.split('-')[0];
  },
  cacheUserLanguage: () => {},
};

const languageDetector = new LanguageDetector();

languageDetector.addDetector(customDetector);

export default languageDetector;
