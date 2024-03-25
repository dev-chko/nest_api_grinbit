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
  IsNumberString,
  isInt,
} from 'class-validator';

@Entity({
  name: 'tb_cloud_pcusage',
  engine: 'InnoDB',
  database: 'cloudpc',
  schema: 'tb_cloud_pcusage',
  synchronize: false,
  orderBy: {
    puIdx: 'ASC',
  },
})
export class PCUsage {
  @PrimaryGeneratedColumn()
  puIdx: number;

  @Column('bigint')
  @IsInt()
  rIdx: number;

  @Column('bigint')
  @IsInt()
  pcIdx: number;

  @Column()
  @IsInt()
  totalSeconds: number;

  @Column()
  @IsInt()
  totalPoint: number;

  @Column({ type: 'datetime' })
  @IsDate()
  computeDate: Date;

  @Column({ type: 'datetime' })
  created: Date;
}
