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
  name: 'tb_cloud_usage',
  engine: 'InnoDB',
  database: 'cloudpc',
  schema: 'tb_cloud_usage',
  synchronize: false,
  orderBy: {
    uIdx: 'ASC',
  },
})
export class Usage {
  @PrimaryGeneratedColumn()
  uIdx: number;

  @Column('bigint')
  @IsInt()
  rIdx: number;

  @Column('bigint')
  @IsInt()
  mIdx: number;

  @Column('bigint')
  @IsInt()
  pcIdx: number;

  @Column()
  @IsInt()
  seconds: number;

  @Column()
  @IsInt()
  point: number;

  @Column({ type: 'datetime' })
  created: Date;
}
