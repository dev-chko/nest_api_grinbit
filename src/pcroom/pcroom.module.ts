import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PCRoomService } from './pcroom.service';
import { PCRoomController } from './pcroom.controller';
import { PCRoom } from './pcroom.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PCRoom])],
  providers: [PCRoomService],
  controllers: [PCRoomController],
})
export class PCRoomModule {}
