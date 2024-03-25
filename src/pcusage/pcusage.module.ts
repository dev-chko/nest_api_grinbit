import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PCUsageService } from './pcusage.service';
import { PCUsageController } from './pcusage.controller';
import { PCUsage } from './pcusage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PCUsage])],
  providers: [PCUsageService],
  controllers: [PCUsageController],
})
export class PCUsageModule {}
