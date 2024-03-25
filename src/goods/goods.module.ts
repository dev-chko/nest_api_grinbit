import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';
import { Goods } from './goods.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Goods])],
  exports: [TypeOrmModule],
  controllers: [GoodsController],
  providers: [GoodsService],
})
export class GoodsModule {}
