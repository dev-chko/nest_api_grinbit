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

import { Public } from 'src/auth/skipAuth.decorator';
import { GoodsService } from './goods.service';
import { Goods } from './goods.entity';
import { pushParamsArgs } from '@redis/search/dist/commands';
import { response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('25. goods')
@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Public()
  @Get('/')
  async getGoodsAll(@Res() response): Promise<Goods[]> {
    try {
      const goodsList = await this.goodsService.findAll();
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'All Goods data found Successfully',
        data: goodsList,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'Bad Requset',
      });
    }
  }

  @Public()
  @Get(':gIdx')
  async findOne(@Res() response, @Param('gIdx') gIdx: number): Promise<Goods> {
    try {
      const data = await this.goodsService.findOne(gIdx);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Goods Found Successfull',
        data: data,
      });
    } catch (err) {
      return response.status(err.status || 500).json(err.response);
    }
  }
}
