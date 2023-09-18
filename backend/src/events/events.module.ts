import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { EventsService } from './events.service';
import { PositionModule } from 'src/position/position.module';

@Module({
  imports: [AuthModule, PositionModule],
  providers: [EventsGateway, EventsService],
})
export class EventsModule {}
