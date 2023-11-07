import { Module, forwardRef } from '@nestjs/common';
import { PositionService } from './position.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Position, PositionSchema } from './schemas/position.schema';
import { PositionController } from './position.controller';
import { EventsModule } from 'src/events/events.module';
import { FriendsModule } from 'src/friends/friends.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Position.name, schema: PositionSchema }]),
    forwardRef(() => EventsModule),
    forwardRef(() => FriendsModule),
  ],
  providers: [PositionService],
  exports: [PositionService],
  controllers: [PositionController],
})
export class PositionModule {}
