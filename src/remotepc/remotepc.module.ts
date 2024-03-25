import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RemotePCService } from './remotepc.service';
import { RemotePCController } from './remotepc.controller';
import { RemotePC } from './remotepc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RemotePC])],
  providers: [RemotePCService],
  controllers: [RemotePCController],
})
export class RemotePCModule {}
