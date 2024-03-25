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
import { UsageService } from './usage.service';
import { Usage } from './usage.entity';

@ApiTags('21. usage')
@ApiBearerAuth('access-token')
@Controller('usage')
export class UsageController {
  constructor(private readonly usageService: UsageService) {}

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
  async create(@Res() response, @Body() usage: Usage) {
    try {
      const create = await this.usageService.create(usage);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'created successfully',
        data: { uIdx: create.uIdx },
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
  //     const list = await this.usageService.findAll();
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
  //     const data = await this.usageService.findOne(id);
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
  async update(@Res() response, @Param('id') id: number, @Body() usage: Usage) {
    try {
      const updated = await this.usageService.save(id, usage);
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
      await this.usageService.remove(id);
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

  @Get(':mIdx')
  async findPersonAll(
    @Res() response,
    @Param('mIdx') mIdx: number,
  ): Promise<Usage> {
    try {
      const data = await this.usageService.findAll(mIdx);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Get Usage history',
        data: data,
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
