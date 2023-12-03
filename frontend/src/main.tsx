import ReactDOM from 'react-dom/client';
import './main.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import languageDetector from './locales/languageDetector';
import en from './locales/en/translation.json';
import ru from './locales/ru/translation.json';
import App from './app/App';

i18next
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    resources: { ru: { translation: ru }, en: { translation: en } },
    supportedLngs: ['en', 'ru'],
    fallbackLng: 'en',
    returnEmptyString: false,
    debug: process.env.NODE_ENV === 'development',
    detection: {
      order: ['localStorage', 'customDetector'],
      caches: ['localStorage'],
      lookupLocalStorage: 'lang',
    },
  });

const rootDiv = document.createElement('div');
rootDiv.setAttribute('id', 'root');
const oldRootDiv = document.getElementById('root')!;
if (oldRootDiv && oldRootDiv.parentElement) {
  oldRootDiv.parentElement.removeChild(oldRootDiv);
}
document.body.appendChild(rootDiv);

ReactDOM.createRoot(rootDiv).render(<App />);
