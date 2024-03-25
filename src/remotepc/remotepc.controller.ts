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
import { RemotePCService } from './remotepc.service';
import { RemotePC } from './remotepc.entity';

@ApiTags('12. remotepc')
@ApiBearerAuth('access-token')
@Controller('remotepc')
export class RemotePCController {
  constructor(private readonly remotepcService: RemotePCService) {}

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
          rIdx: 0,
          mIdx: 1240,
          status: '1',
          ip: 'ip',
          mac: 'mac',
          cpu: 'cpu',
          memory: 'memory',
          video: 'video',
          score: 0,
          desc: 'desc',
        },
      },
    },
  })
  async create(@Res() response, @Body() remotepc: RemotePC) {
    try {
      const create = await this.remotepcService.create(remotepc);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'created successfully',
        data: { pcIdx: create.pcIdx },
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
      const list = await this.remotepcService.findAll();
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
      const data = await this.remotepcService.findOne(id);
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
          rIdx: 0,
          mIdx: 1240,
          status: '1',
          ip: 'ip',
          mac: 'mac',
          cpu: 'cpu',
          memory: 'memory',
          video: 'video',
          score: 0,
          desc: 'desc',
        },
      },
    },
  })
  async update(
    @Res() response,
    @Param('id') id: number,
    @Body() remotepc: RemotePC,
  ) {
    try {
      const updated = await this.remotepcService.save(id, remotepc);
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
      await this.remotepcService.remove(id);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Deleted successfully',
        data: { pcIdx: id },
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
