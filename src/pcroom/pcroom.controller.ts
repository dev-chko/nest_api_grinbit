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
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PCRoomService } from './pcroom.service';
import { PCRoom } from './pcroom.entity';

@ApiTags('11. pcroom')
@ApiBearerAuth('access-token')
@Controller('pcroom')
export class PCRoomController {
  constructor(private readonly pcroomService: PCRoomService) {}

  /**
   * create
   *
   * @param response
   * @param pcroom
   * @returns
   */
  @Post()
  @ApiBody({
    description: 'PC방 내용을 입력한다.',
    examples: {
      create: {
        summary: 'create',
        value: {
          roomName: 'room name',
          location: 'location',
          desc: 'desc',
          mIdx: 1240,
          ownerName: 'owner name',
          address: 'address',
          bizName: 'biz name',
          bizSector: 'biz sector',
          bizCategory: 'biz category',
          bizNumber: '1231212345',
          regDate: '2022-12-12 10:20:30',
        },
      },
    },
  })
  async create(@Res() response, @Body() pcroom: PCRoom) {
    try {
      const create = await this.pcroomService.create(pcroom);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'created successfully',
        data: { rIdx: create.rIdx },
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'Bad Request',
      });
    }
  }

  /**
   * get all
   *
   * @param response
   * @returns
   */
  @Get()
  async getAll(@Res() response) {
    try {
      const list = await this.pcroomService.findAll();
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Found successfully',
        data: list,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'Bad Request',
      });
    }
  }

  /**
   * get
   *
   * @param response
   * @param id
   * @returns
   */
  @Get('/:id')
  async get(@Res() response, @Param('id') id: number) {
    try {
      const data = await this.pcroomService.findOne(id);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Found successfully',
        data,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'Bad Request',
      });
    }
  }

  /**
   * put
   *
   * @param response
   * @param id
   * @param pcroom
   * @returns
   */
  @Put('/:id')
  @ApiBody({
    description: 'PC방 수정내용을 입력한다.',
    examples: {
      modify: {
        summary: 'input user info.',
        value: {
          roomName: 'room name',
          location: 'location',
          desc: 'desc',
          mIdx: 1240,
          ownerName: 'owner name',
          address: 'address',
          bizName: 'biz name',
          bizSector: 'biz sector',
          bizCategory: 'biz category',
          bizNumber: '1231212345',
          regDate: '2022-12-12 10:20:30',
        },
      },
    },
  })
  async update(
    @Res() response,
    @Param('id') id: number,
    @Body() pcroom: PCRoom,
  ) {
    try {
      const updated = await this.pcroomService.save(id, pcroom);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Updated successfully',
        data: { ...updated },
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'Bad Request',
      });
    }
  }

  /**
   * delete
   *
   * @param response
   * @param id
   * @returns
   */
  @Delete('/:id')
  async delete(@Res() response, @Param('id') id: number) {
    try {
      await this.pcroomService.remove(id);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Deleted successfully',
        data: { rIdx: id },
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'Bad Request',
      });
    }
  }
}
