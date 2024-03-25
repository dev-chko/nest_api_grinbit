import { Module } from '@nestjs/common';
import { PointService } from './point.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Point } from './point.entity';
import { PointController } from './point.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Point])],
  exports: [TypeOrmModule],
  controllers: [PointController],
  providers: [PointService],
})
export class PointModule {}
