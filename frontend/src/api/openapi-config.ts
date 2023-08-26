import type { ConfigFile } from '@rtk-query/codegen-openapi';
import { resolve } from 'path';

const config: ConfigFile = {
  schemaFile: resolve('../../../openapi.yaml'),
  apiFile: resolve('./emptyApi.ts'),
  apiImport: 'emptySplitApi',
  outputFile: resolve('./api.ts'),
  exportName: 'api',
  hooks: true,
  tag: true,
};

export default config;
