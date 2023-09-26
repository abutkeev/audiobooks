import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { PositionModule } from './position/position.module';
import { ReadersModule } from './readers/readers.module';
import { CommonModule } from './common/common.module';
import { PersonsModule } from './persons/persons.module';
import { AuthorsModule } from './authors/authors.module';

@Module({
  imports: [
    // need to use env files
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URI),
    UsersModule,
    AuthModule,
    EventsModule,
    PositionModule,
    ReadersModule,
    CommonModule,
    PersonsModule,
    AuthorsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
