import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsController } from './boards.controller';
import { Boards } from './boards.entity';
import { BoardsReply } from 'src/boards_reply/boards_reply.entity';
import { BoardsService } from './boards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Boards]),
    TypeOrmModule.forFeature([BoardsReply]),
  ],
  exports: [TypeOrmModule],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
