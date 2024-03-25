import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { BoardsReply } from './boards_reply.entity';
import { BoardsReplyService } from './boards_reply.service';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/skipAuth.decorator';

@ApiTags('31-1. boards Reply')
@ApiBearerAuth('access-token')
@Controller('boards-reply')
export class BoardsReplyController {}
