import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Point } from './point.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
  ) {}

  async findAll(): Promise<Point[]> {
    return await this.pointRepository.find();
  }

  async findOne(mIdx: number): Promise<Point> {
    return await this.pointRepository.findOne({
      where: { mIdx },
    });
  }

  async findOneByMidx(mIdx: number): Promise<Point> {
    return await this.pointRepository.findOne({
      where: { mIdx },
    });
  }

  async create(mIdx: number, data: Point): Promise<Point> {
    const { balance } = data;
    const point = this.pointRepository.create(data);
    const userInfo = await this.pointRepository.findOne({
      where: { mIdx: data.mIdx },
    });

    if (userInfo) {
      // await this.pointRepository.update(mIdx, userInfo);
      (userInfo.mIdx = mIdx), (userInfo.balance = userInfo.balance + balance);
      await this.pointRepository.update({ pIdx: userInfo.pIdx }, userInfo);
    } else {
      await this.pointRepository.save(point);
      return;
    }

    return userInfo;
  }

  async save(point: Point): Promise<UpdateResult> {
    const result: UpdateResult = await this.pointRepository.update(
      { pIdx: point.pIdx },
      point,
    );

    return result;
  }
}
