import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsReply } from './boards_reply.entity';
import { BoardsReplyController } from './boards_reply.controller';
import { BoardsReplyService } from './boards_reply.service';

@Module({
  imports: [TypeOrmModule.forFeature([BoardsReply])],
  exports: [TypeOrmModule],
  controllers: [BoardsReplyController],
  providers: [BoardsReplyService],
})
export class BoardsReplyModule {}
