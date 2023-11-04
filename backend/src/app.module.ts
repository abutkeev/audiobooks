import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { PositionModule } from './position/position.module';
import { ReadersModule } from './readers/readers.module';
import { CommonModule } from './common/common.module';
import { PersonsModule } from './persons/persons.module';
import { AuthorsModule } from './authors/authors.module';
import { SeriesModule } from './series/series.module';
import { BooksModule } from './books/books.module';
import { DB_URI } from './constants';
import { SignUpModule } from './sign-up/sign-up.module';

@Module({
  imports: [
    MongooseModule.forRoot(DB_URI),
    UsersModule,
    AuthModule,
    EventsModule,
    PositionModule,
    ReadersModule,
    CommonModule,
    PersonsModule,
    AuthorsModule,
    SeriesModule,
    BooksModule,
    SignUpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
