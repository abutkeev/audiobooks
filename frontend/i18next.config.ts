import { defineConfig } from 'i18next-cli';

export default defineConfig({
  locales: ['en', 'ru'],
  extract: {
    input: ['src/**/*.tsx', 'src/**/*.ts'],
    output: 'src/locales/{{language}}/{{namespace}}.json',
    defaultNS: 'translation',
    keySeparator: false,
    nsSeparator: false,
    functions: ['t', '*.t'],
    transComponents: ['Trans'],
  },
});
