import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { PCUsage } from './pcusage-montly.entity';

@Injectable()
export class PcusageMontlyService {
  constructor(
    @InjectRepository(PCUsage)
    private pcusageMontlyRepository: Repository<PCUsage>,
  ) {}

  async create(pcusage: PCUsage): Promise<PCUsage> {
    const newPCUsage = this.pcusageMontlyRepository.create(pcusage);
    return this.pcusageMontlyRepository.save(newPCUsage);
  }

  async findAll(): Promise<PCUsage[]> {
    return await this.pcusageMontlyRepository.find();
  }

  async findOne(pumIdx: number): Promise<PCUsage> {
    return await this.pcusageMontlyRepository.findOne({
      where: { pumIdx },
    });
  }

  async save(pumIdx: number, usage: PCUsage): Promise<PCUsage> {
    // TODO: update() 호출로 변경할 것.
    let update = await this.pcusageMontlyRepository.findOne({
      where: { pumIdx },
    });

    update = { ...update, ...usage };

    return await this.pcusageMontlyRepository.save(update);
  }

  async remove(uIdx: number): Promise<void> {
    await this.pcusageMontlyRepository.delete(uIdx);
  }
}
