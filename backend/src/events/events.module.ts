import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { EventsService } from './events.service';

@Module({
  imports: [AuthModule],
  providers: [EventsGateway, EventsService],
})
export class EventsModule {}
