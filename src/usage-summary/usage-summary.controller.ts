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
import { UsageSummaryService } from './usage-summary.service';
import { UsageSummary } from './usage-summary.entitiy';

@ApiTags('21-1. usage-summary')
@ApiBearerAuth('access-token')
@Controller('usage-summary')
export class UsageSummaryController {
  constructor(private readonly usageSummaryService: UsageSummaryService) {}

  /**
   * create
   *
   * @param response
   * @param pcroom
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
          mIdx: 1240,
          pcIdx: 1,
          seconds: 30,
        },
      },
    },
  })
  async create(@Res() response, @Body() usageSummary: UsageSummary) {
    try {
      const create = await this.usageSummaryService.create(usageSummary);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'created successfully',
        data: { usIdx: create.usIdx },
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
  // @Get()
  // async getAll(@Res() response) {
  //   try {
  //     const list = await this.usageSummaryService.findAll();
  //     return response.status(HttpStatus.OK).json({
  //       statusCode: 200,
  //       message: 'Found successfully',
  //       data: list,
  //     });
  //   } catch (err) {
  //     return response.status(HttpStatus.BAD_REQUEST).json({
  //       statusCode: 400,
  //       message: err.message,
  //       error: 'Bad Request',
  //     });
  //   }
  // }

  /**
   * get
   *
   * @param response
   * @param id
   * @returns
   */
  // @Get('/:id')
  // async get(@Res() response, @Param('id') id: number) {
  //   try {
  //     const data = await this.usageSummaryService.findOne(id);
  //     return response.status(HttpStatus.OK).json({
  //       statusCode: 200,
  //       message: 'Found successfully',
  //       data,
  //     });
  //   } catch (err) {
  //     return response.status(HttpStatus.BAD_REQUEST).json({
  //       statusCode: 400,
  //       message: err.message,
  //       error: 'Bad Request',
  //     });
  //   }
  // }

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
          mIdx: 1240,
          pcIdx: 1,
          seconds: 60,
        },
      },
    },
  })
  async update(
    @Res() response,
    @Param('id') id: number,
    @Body() usageSummary: UsageSummary,
  ) {
    try {
      const updated = await this.usageSummaryService.save(id, usageSummary);
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
      await this.usageSummaryService.remove(id);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Deleted successfully',
        data: { usIdx: id },
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'Bad Request',
      });
    }
  }

  @Get(':mIdx')
  async findPersonAll(
    @Res() response,
    @Param('mIdx') mIdx: number,
  ): Promise<UsageSummary> {
    try {
      const data = await this.usageSummaryService.findAll(mIdx);

      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Get UsageSummary history',
        data: data,
      });
    } catch (err) {
      console.log(err);

      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'Bad Request',
      });
    }
  }
}
