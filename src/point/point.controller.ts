import {
  Controller,
  Body,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';

import { PointService } from './point.service';
import { Point } from './point.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('26. point')
@ApiBearerAuth('access-token')
@Controller('point')
export class PointController {
  constructor(private readonly pointService: PointService) {
    this.pointService = pointService;
  }

  @Get(':mIdx')
  async findOneByMidx(
    @Res() response,
    @Param('mIdx') mIdx: number,
  ): Promise<Point> {
    try {
      const foundPoint = await this.pointService.findOneByMidx(mIdx);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: `Point found successfully`,
        data: foundPoint,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'Bad Request',
      });
    }
  }

  @Post(':mIdx')
  async chargePoint(
    @Res() response,
    @Param('mIdx') mIdx: number,
    @Body() data,
  ): Promise<any> {
    try {
      const chargePoint = await this.pointService.create(mIdx, data);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Create Receipt',
        data: { ...chargePoint },
      });
    } catch (err) {
      console.log('err :>> ', err);
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: `${err}`,
      });
    }
  }
}
