import { Module } from '@nestjs/common';
import { PositionService } from './position.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Position, PositionSchema } from './schemas/position.schema';
import { PositionController } from './position.controller';
import { EventsService } from 'src/events/events.service';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Position.name, schema: PositionSchema }]), UsersModule, AuthModule],
  providers: [PositionService, EventsService],
  exports: [PositionService],
  controllers: [PositionController],
})
export class PositionModule {}
