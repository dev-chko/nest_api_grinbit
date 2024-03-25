import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsageService } from './usage.service';
import { UsageController } from './usage.controller';
import { Usage } from './usage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usage])],
  providers: [UsageService],
  controllers: [UsageController],
})
export class UsageModule {}
