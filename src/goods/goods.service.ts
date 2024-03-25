import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goods } from './goods.entity';

@Injectable()
export class GoodsService {
  constructor(
    @InjectRepository(Goods)
    private goodsRepository: Repository<Goods>,
  ) {}

  async findOne(gIdx: number): Promise<Goods> {
    return await this.goodsRepository.findOne({
      where: { gIdx },
    });
  }

  async findAll(): Promise<Goods[]> {
    return await this.goodsRepository.find();
  }
}
