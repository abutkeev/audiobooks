const i18nextParserConfig = {
  locales: ['en', 'ru'],
  output: './src/locales/$LOCALE/$NAMESPACE.json',
  input: ['../**/*.tsx', '../**/*.ts'],
  keySeparator: false,
  namespaceSeparator: false,
  useKeysAsDefaultValue: true,
  defaultNamespace: 'translation',
};

export default i18nextParserConfig;
