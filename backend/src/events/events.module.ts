import { Module, forwardRef } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { EventsService } from './events.service';
import { PositionModule } from 'src/position/position.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [forwardRef(() => AuthModule), forwardRef(() => PositionModule), forwardRef(() => UsersModule)],
  providers: [EventsGateway, EventsService],
  exports: [EventsService],
})
export class EventsModule {}
