import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
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
import { DB_URI, LAZY_DB_CONNECTION, TELEGRAM_BOT_TOKEN, TELEGRAM_PROXY } from './constants';
import { SignUpModule } from './sign-up/sign-up.module';
import { FriendsModule } from './friends/friends.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { TgBotModule } from './tg-bot/tg-bot.module';
import { TelegramModule } from './telegram/telegram.module';
import { ProfileModule } from './profile/profile.module';
import { ExternalPlaylistModule } from './external-playlist/external-playlist.module';
import { LogModule } from './log/log.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';

@Module({
  imports: [
    MongooseModule.forRoot(DB_URI, { lazyConnection: LAZY_DB_CONNECTION === 'true' }),
    // a real client sends a batch every 30 seconds; the burst comes from the api error saver
    ThrottlerModule.forRoot([{ limit: 30, ttl: 60000 }]),
    TelegrafModule.forRoot({
      token: TELEGRAM_BOT_TOKEN,
      launchOptions: false,
      options: TELEGRAM_PROXY ? { telegram: { agent: new SocksProxyAgent(TELEGRAM_PROXY) } } : undefined,
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
    LogModule,
    BookmarksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
