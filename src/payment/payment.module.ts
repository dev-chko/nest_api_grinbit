import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { PaymentController } from './payment.controller';
import { HttpModule } from '@nestjs/axios';
import { Point } from 'src/point/point.entity';
import { PointService } from 'src/point/point.service';
import { Goods } from 'src/goods/goods.entity';
import { GoodsService } from 'src/goods/goods.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    TypeOrmModule.forFeature([Point]),
    TypeOrmModule.forFeature([Goods]),
    HttpModule,
  ],
  exports: [TypeOrmModule],
  controllers: [PaymentController],
  providers: [PaymentService, PointService, GoodsService],
})
export class PaymentModule {}
