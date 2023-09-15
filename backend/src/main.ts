import { Logger } from '@nestjs/common';
import { setup } from './app';

async function bootstrap() {
  const logger = new Logger('main');
  const app = await setup();
  const PORT = process.env.PORT || 4000;
  await app.listen(PORT, () => logger.log(`Server started on PORT ${PORT}`));
}
bootstrap();
