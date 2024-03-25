import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UsageSummary } from './usage-summary.entitiy';

@Injectable()
export class UsageSummaryService {
  constructor(
    @InjectRepository(UsageSummary)
    private usageSummaryService: Repository<UsageSummary>,
  ) {}

  async create(usageSummary: UsageSummary): Promise<UsageSummary> {
    const newUsageSummary = this.usageSummaryService.create(usageSummary);
    return this.usageSummaryService.save(newUsageSummary);
  }

  async findAll(mIdx: number): Promise<UsageSummary[]> {
    return await this.usageSummaryService.find({
      where: { mIdx: mIdx },
      order: {
        created: 'DESC',
      },
    });
  }

  async findOne(usIdx: number): Promise<UsageSummary> {
    return await this.usageSummaryService.findOne({
      where: { usIdx },
    });
  }

  async save(usIdx: number, usageSummary: UsageSummary): Promise<UsageSummary> {
    // TODO: update() 호출로 변경할 것.
    let update = await this.usageSummaryService.findOne({
      where: { usIdx },
    });

    update = { ...update, ...usageSummary };

    return await this.usageSummaryService.save(update);
  }

  async remove(uIdx: number): Promise<void> {
    await this.usageSummaryService.delete(uIdx);
  }
}
