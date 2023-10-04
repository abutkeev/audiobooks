import { Logger } from '@nestjs/common';
import { setup } from './app';
import { PORT } from './constants';

async function bootstrap() {
  const logger = new Logger('main');
  const app = await setup();
  const APP_PORT = PORT || 4000;
  await app.listen(APP_PORT, () => logger.log(`Server started on PORT ${APP_PORT}`));
}
bootstrap();
