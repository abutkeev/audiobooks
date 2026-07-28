import { writeFileSync } from 'fs';

// generation only needs the DI graph, so the app must not wait for a database connection;
// the flag is set before importing app to be picked up by constants
process.env.LAZY_DB_CONNECTION = 'true';

const generate = async () => {
  const { getOpenAPIDocument, setup } = await import('./app');
  const app = await setup({ logger: ['error', 'warn'] });
  const doc = getOpenAPIDocument(app);
  writeFileSync('openapi.json', JSON.stringify(doc, null, 2));
  process.exit(0);
};

generate();
