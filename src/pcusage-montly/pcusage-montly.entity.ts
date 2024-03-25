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
  name: 'tb_cloud_board',
  engine: 'InnoDB',
  database: 'cloudpc',
  schema: 'tb_cloud_pc_usage_montly',
  synchronize: false,
  orderBy: {
    pumIdx: 'DESC',
  },
})
export class PCUsage {
  @PrimaryGeneratedColumn()
  pumIdx: number;

  @Column()
  bIdx: number;

  @Column()
  rIdx: number;

  @Column()
  pcIdx: number;

  @Column()
  totalSeconds: number;

  @Column()
  totalPoint: number;

  @Column({ type: 'date' })
  computeDate: Date;

  @Column({ type: 'datetime' })
  created: Date;
}
