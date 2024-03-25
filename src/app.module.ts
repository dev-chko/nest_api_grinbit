import { Module } from '@nestjs/common';

import { SocketModule } from './socket/socket.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwtAuth.guard';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PCRoomModule } from './pcroom/pcroom.module';
import { RemotePCModule } from './remotepc/remotepc.module';
import { UsageModule } from './usage/usage.module';
import { BoardsModule } from './boards/boards.module';
import { PCUsageModule } from './pcusage/pcusage.module';
import { PointModule } from './point/point.module';
import { PaymentModule } from './payment/payment.module';
import { GoodsModule } from './goods/goods.module';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { ContactusModule } from './contactus/contactus.module';
import { UsageSummaryModule } from './usage-summary/usage-summary.module';
import { PcusageMontlyModule } from './pcusage-montly/pcusage-montly.module';
import { BoardsReplyModule } from './boards_reply/boards_reply.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV === 'development' ? true : false,
      keepConnectionAlive: true,
      extra: {
        connectionLimit: 10, // Set connection pool size
      },
      autoLoadEntities: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        process.env.NODE_ENV === 'development' ? '../dist/build' : './build',
      ),
      exclude: ['/api/*'],
    }),

    SocketModule,

    AuthModule, // 1
    UserModule, // 2
    PCRoomModule, // 11
    RemotePCModule, // 12
    UsageModule, // 21
    PCUsageModule, // 22
    PaymentModule, // 24
    GoodsModule, // 25
    PointModule, // 26
    BoardsModule, // 31
    EmailModule,
    ContactusModule,
    UsageSummaryModule,
    PcusageMontlyModule,
    BoardsReplyModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    EmailService,
  ],
})
export class AppModule {}
