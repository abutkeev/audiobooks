import { writeFileSync } from 'fs';
import { getOpenAPIDocument, setup } from './app';
import path from 'path';

const generate = async () => {
  const app = await setup({ logger: ['error', 'warn'] });
  const doc = getOpenAPIDocument(app);
  writeFileSync('openapi.json', JSON.stringify(doc, null, 2));
  app.close();
};

generate();
