import { Module } from '@nestjs/common';
import { PcusageMontlyService } from './pcusage-montly.service';
import { PcusageMontlyController } from './pcusage-montly.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PCUsage } from './pcusage-montly.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PCUsage])],
  providers: [PcusageMontlyService],
  controllers: [PcusageMontlyController],
})
export class PcusageMontlyModule {}
