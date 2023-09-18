import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { EventsService } from './events.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Position, PositionSchema } from './schemas/position.schema';

@Module({
  imports: [AuthModule, MongooseModule.forFeature([{ name: Position.name, schema: PositionSchema }])],
  providers: [EventsGateway, EventsService],
})
export class EventsModule {}
