import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), forwardRef(() => EventsModule)],
  providers: [UsersService],
  exports: [UsersService, MongooseModule],
  controllers: [UsersController],
})
export class UsersModule {}
