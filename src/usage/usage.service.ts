import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Usage } from './usage.entity';

@Injectable()
export class UsageService {
  constructor(
    @InjectRepository(Usage)
    private remotepcRepository: Repository<Usage>,
  ) {}

  async create(usage: Usage): Promise<Usage> {
    const newUsage = this.remotepcRepository.create(usage);
    return this.remotepcRepository.save(newUsage);
  }

  async findAll(mIdx: number): Promise<Usage[]> {
    return await this.remotepcRepository.find({
      where: { mIdx: mIdx },
      order: {
        created: 'DESC',
      },
    });
  }

  async findOne(uIdx: number): Promise<Usage> {
    return await this.remotepcRepository.findOne({
      where: { uIdx },
    });
  }

  async save(uIdx: number, usage: Usage): Promise<Usage> {
    // TODO: update() 호출로 변경할 것.
    let update = await this.remotepcRepository.findOne({
      where: { uIdx },
    });

    update = { ...update, ...usage };

    return await this.remotepcRepository.save(update);
  }

  async remove(uIdx: number): Promise<void> {
    await this.remotepcRepository.delete(uIdx);
  }
}
