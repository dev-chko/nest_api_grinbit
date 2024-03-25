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
import { PcusageMontlyService } from './pcusage-montly.service';
import { PCUsage } from './pcusage-montly.entity';

@ApiTags('22-1. pcusage-montly')
@ApiBearerAuth('access-token')
@Controller('pcusage-montly')
export class PcusageMontlyController {
  constructor(private readonly pcusageMontlyService: PcusageMontlyService) {}

  /**
   * create
   *
   * @param response
   * @param pcusage
   * @returns
   */
  @Post()
  @ApiBody({
    description: '내용을 입력한다.',
    examples: {
      create: {
        summary: 'create',
        value: {
          rIdx: 0,
          pcIdx: 1,
          totalSeconds: 30,
          totalPoint: 30,
          computeDate: '2022-11-26',
        },
      },
    },
  })
  async create(@Res() response, @Body() pcUsage: PCUsage) {
    try {
      const create = await this.pcusageMontlyService.create(pcUsage);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'created successfully',
        data: { pumIdx: create.pumIdx },
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
      const list = await this.pcusageMontlyService.findAll();
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
      const data = await this.pcusageMontlyService.findOne(id);
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
    description: '수정내용을 입력한다.',
    examples: {
      modify: {
        summary: 'input user info.',
        value: {
          rIdx: 0,
          pcIdx: 1,
          totalSeconds: 30,
          totalPoint: 30,
          computeDate: '2022-11-26',
        },
      },
    },
  })
  async update(
    @Res() response,
    @Param('id') id: number,
    @Body() pcUsage: PCUsage,
  ) {
    try {
      const updated = await this.pcusageMontlyService.save(id, pcUsage);
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
      await this.pcusageMontlyService.remove(id);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Deleted successfully',
        data: { uIdx: id },
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
