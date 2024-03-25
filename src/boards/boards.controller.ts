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
import { BoardsService } from './boards.service';
import { Boards } from './boards.entity';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/skipAuth.decorator';

enum BoardCategory {
  notice = 'notice',
  faq = 'faq',
  bbs = 'bbs',
}

@ApiTags('31. boards')
@ApiBearerAuth('access-token')
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  @ApiBody({
    description: '게시물 내용을 입력한다.',
    examples: {
      'input-user': {
        summary: 'input board info.',
        value: {
          category: 'notice',
          subject: 'subject',
          body: 'body text',
          readCount: 0,
          writer: 'writer',
          writerIdx: 0,
          isPublic: false,
          isTopDisplay: false,
        },
      },
    },
  })
  async createBoards(@Res() response, @Body() boards: Boards) {
    try {
      const newBoards = await this.boardsService.create(boards);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Boards has been created successfully',
        data: { bIdx: newBoards.bIdx },
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Boards not created!',
        error: 'Bad Request',
      });
    }
  }

  @Public()
  @ApiQuery({
    name: 'category',
    description: '게시판 구분',
    // enum: BoardCategory,
  })
  @Get()
  async getBoardsPage(
    @Res() response,
    @Query('category') category: string = 'notice',
    @Query('perPage') perPage: number = 20,
    @Query('page') page: number = 1,
    @Query('sort') sort: string = 'DESC',
  ) {
    try {
      const { boardsList, totalCount } = await this.boardsService.findPage(
        category,
        perPage,
        page,
        sort,
      );
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'All categories data found successfully',
        totalPage: Math.floor(totalCount / perPage) + 1,
        totalRows: totalCount,
        data: boardsList,
      });
    } catch (err) {
      return response.status(err.status || 500).json(err.response);
    }
  }

  @Public()
  @Get('/inquiry/:mIdx')
  async qnaBoard(@Res() response, @Param('mIdx') mIdx: number) {
    try {
      const data = await this.boardsService.findByAllmIdx(mIdx);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Users Boards found success',
        data: data,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Boards not created!_controller',
        error: 'Bad Request',
      });
    }
  }

  @Public()
  @Get('/:id')
  async getBoards(@Res() response, @Param('id') boardsId: number) {
    try {
      const data = await this.boardsService.findOne(boardsId);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Boards found successfully',
        data,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Boards not created!',
        error: 'Bad Request',
      });
    }
  }

  @Put('/:id')
  @ApiBody({
    description: '게시물 수정사항을 입력한다.',
    examples: {
      'input-user': {
        summary: 'input user info.',
        value: {
          category: 'notice',
          subject: 'subject',
          body: 'body text',
          readCount: 0,
          writer: 'writer',
          writerIdx: 0,
          isPublic: false,
          isTopDisplay: false,
        },
      },
    },
  })
  async updateBoards(
    @Res() response,
    @Param('id') boardsId: number,
    @Body() updateBoards: Boards,
  ) {
    try {
      const updated = await this.boardsService.save(boardsId, updateBoards);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Boards has been successfully updated',
        data: { ...updated },
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Boards not created!',
        error: 'Bad Request',
      });
    }
  }

  @Get('/:id/readcount')
  async updateBoardsReadCount(@Res() response, @Param('id') bIdx: number) {
    try {
      const updated = await this.boardsService.updateReadCount(bIdx);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'count added',
        data: { ...updated },
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Boards not created!',
        error: 'Bad Request',
      });
    }
  }

  @Delete('/:id')
  async deleteBoards(@Res() response, @Param('id') boardsId: number) {
    try {
      await this.boardsService.remove(boardsId);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Boards deleted successfully',
        data: { bIdx: boardsId },
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Boards not created!',
        error: 'Bad Request',
      });
    }
  }
}
