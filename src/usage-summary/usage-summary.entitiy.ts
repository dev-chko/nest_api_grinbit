import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
} from 'class-validator';

@Entity({
  name: 'tb_cloud_usage_summary',
  engine: 'InnoDB',
  database: 'cloudpc',
  schema: 'tb_cloud_usage_summary',
  synchronize: false,
  orderBy: {
    pumIdx: 'DESC',
  },
})
export class UsageSummary {
  @PrimaryGeneratedColumn()
  usIdx: number;

  @Column()
  rIdx: number;

  @Column()
  mIdx: number;

  @Column()
  pcIdx: number;

  @Column()
  seconds: number;

  @Column()
  point: number;

  @Column({ type: 'datetime' })
  startConnection: Date;

  @Column({ type: 'datetime' })
  endConnection: Date;

  @Column({ type: 'datetime' })
  created: Date;
}
