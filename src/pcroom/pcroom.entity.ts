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
} from 'class-validator';

@Entity({
  name: 'tb_cloud_pcroom',
  engine: 'InnoDB',
  database: 'cloudpc',
  schema: 'tb_cloud_pcroom',
  synchronize: false,
  orderBy: {
    rIdx: 'ASC',
  },
})
export class PCRoom {
  @PrimaryGeneratedColumn()
  rIdx: number;

  @Column()
  @Length(1, 100)
  roomName: string;

  @Column()
  @Length(1, 200)
  location: string;

  @Column()
  @Length(1, 500)
  desc: string;

  @Column('bigint')
  @IsInt()
  mIdx: number;

  @Column()
  @Length(1, 32)
  ownerName: string;

  @Column()
  @Length(1, 200)
  address: string;

  @Column()
  @Length(1, 64)
  bizName: string;

  @Column()
  @Length(1, 64)
  bizSector: string;

  @Column()
  @Length(1, 64)
  bizCategory: string;

  @Column()
  @Length(6, 11)
  @IsNumberString()
  bizNumber: string;

  @Column()
  regDate: Date;

  @Column({ type: 'datetime' })
  created: Date;

  @Column({ type: 'datetime' })
  modified: Date;
}
