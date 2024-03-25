import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PCRoom } from 'src/pcroom/pcroom.entity';
import { PCRoomService } from 'src/pcroom/pcroom.service';
import { Point } from 'src/point/point.entity';
import { PointService } from 'src/point/point.service';
import { RemotePC } from 'src/remotepc/remotepc.entity';
import { RemotePCService } from 'src/remotepc/remotepc.service';
import { Usage } from 'src/usage/usage.entity';
import { UsageService } from 'src/usage/usage.service';
import { SocketGateway } from './socket.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([PCRoom, RemotePC, Point, Usage])],
  providers: [
    SocketGateway,
    PCRoomService,
    RemotePCService,
    PointService,
    UsageService,
  ],
})
export class SocketModule {}
