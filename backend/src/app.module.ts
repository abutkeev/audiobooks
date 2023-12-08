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
import { DB_URI, TELEGRAM_BOT_TOKEN } from './constants';
import { SignUpModule } from './sign-up/sign-up.module';
import { FriendsModule } from './friends/friends.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { TgBotModule } from './tg-bot/tg-bot.module';
import { TelegramModule } from './telegram/telegram.module';
import { ProfileModule } from './profile/profile.module';
import { ExternalPlaylistModule } from './external-playlist/external-playlist.module';

@Module({
  imports: [
    MongooseModule.forRoot(DB_URI),
    TelegrafModule.forRoot({
      token: TELEGRAM_BOT_TOKEN,
    }),
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
    FriendsModule,
    TgBotModule,
    TelegramModule,
    ProfileModule,
    ExternalPlaylistModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
