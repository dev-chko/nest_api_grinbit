import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { PCUsage } from './pcusage.entity';

@Injectable()
export class PCUsageService {
  constructor(
    @InjectRepository(PCUsage)
    private remotepcRepository: Repository<PCUsage>,
  ) {}

  async create(pcusage: PCUsage): Promise<PCUsage> {
    const newPCUsage = this.remotepcRepository.create(pcusage);
    return this.remotepcRepository.save(newPCUsage);
  }

  async findAll(): Promise<PCUsage[]> {
    return await this.remotepcRepository.find();
  }

  async findOne(puIdx: number): Promise<PCUsage> {
    return await this.remotepcRepository.findOne({
      where: { puIdx },
    });
  }

  async save(puIdx: number, usage: PCUsage): Promise<PCUsage> {
    // TODO: update() 호출로 변경할 것.
    let update = await this.remotepcRepository.findOne({
      where: { puIdx },
    });

    update = { ...update, ...usage };

    return await this.remotepcRepository.save(update);
  }

  async remove(uIdx: number): Promise<void> {
    await this.remotepcRepository.delete(uIdx);
  }
}
