import {
  HttpModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProfileMiddleware } from './middleware/profile.middleware';
import { UsersModule } from './users/users.module';
import { SectionsModule } from './sections/sections.module';
import { EventsModule } from './events/events.module';
import { MembershipsModule } from './memberships/memberships.module';
import { SectionMiddleware } from '@esn/server/middleware/section.middleware';
import { Auth0Service } from './services/auth0.service';
import { MailsService } from './services/mails.service';
import { InviteModule } from './invite/invite.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'client'),
    }),
    ConfigModule.forRoot(),
    HttpModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mssql',
        host: 'esn.database.windows.net',
        port: 1433,
        username: 'lukas',
        password: configService.get<string>('PASSWORD'),
        database: configService.get<string>('DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        // autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    SectionsModule,
    EventsModule,
    MembershipsModule,
    InviteModule,
  ],
  controllers: [AppController],
  providers: [AppService, Auth0Service, MailsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProfileMiddleware).forRoutes('*');
    consumer.apply(SectionMiddleware).forRoutes('*');
  }
}
