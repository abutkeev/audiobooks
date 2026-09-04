import { Logger } from '@nestjs/common';
import { setup } from './app';
import { LISTEN_ADDRESS, PORT } from './constants';

// the loopback by default, see docs/ai/backend/index.md
const defaultAddress = '127.0.0.1';

async function bootstrap() {
  const logger = new Logger('main');
  const app = await setup();
  const APP_PORT = PORT || 4000;
  const address = LISTEN_ADDRESS || defaultAddress;
  await app.listen(APP_PORT, address, () => logger.log(`Server started on ${address}:${APP_PORT}`));
}
bootstrap();
