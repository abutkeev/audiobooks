import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { UsersModule } from 'src/users/users.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [UsersModule, EventsModule],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
