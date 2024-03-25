import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsageSummaryService } from './usage-summary.service';
import { UsageSummaryController } from './usage-summary.controller';
import { UsageSummary } from './usage-summary.entitiy';

@Module({
  imports: [TypeOrmModule.forFeature([UsageSummary])],
  providers: [UsageSummaryService],
  controllers: [UsageSummaryController],
})
export class UsageSummaryModule {}
