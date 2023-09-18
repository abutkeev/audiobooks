import { Module } from '@nestjs/common';
import { PositionService } from './position.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Position, PositionSchema } from './schemas/position.schema';
import { PositionController } from './position.controller';
import { EventsService } from 'src/events/events.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Position.name, schema: PositionSchema }])],
  providers: [PositionService, EventsService],
  exports: [PositionService],
  controllers: [PositionController],
})
export class PositionModule {}
