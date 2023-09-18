import { Module } from '@nestjs/common';
import { PositionService } from './position.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Position, PositionSchema } from './schemas/position.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Position.name, schema: PositionSchema }])],
  providers: [PositionService],
  exports: [PositionService],
})
export class PositionModule {}
