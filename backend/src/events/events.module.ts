import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { EventsService } from './events.service';
import { PositionModule } from 'src/position/position.module';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [AuthModule, PositionModule, UsersModule],
  providers: [EventsGateway, EventsService, UsersService],
  exports: [EventsService],
})
export class EventsModule {}
