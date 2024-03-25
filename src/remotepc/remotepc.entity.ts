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
  name: 'tb_cloud_remotepc',
  engine: 'InnoDB',
  database: 'cloudpc',
  schema: 'tb_cloud_remotepc',
  synchronize: false,
  orderBy: {
    pcIdx: 'ASC',
  },
})
export class RemotePC {
  @PrimaryGeneratedColumn()
  pcIdx: number;

  @Column('bigint')
  @IsInt()
  rIdx: number;

  @Column('bigint')
  @IsInt()
  mIdx: number;

  @Column()
  @Length(1, 12)
  status: string;

  @Column()
  @Length(1, 128)
  name: string;

  @Column()
  @Length(1, 15)
  ip: string;

  @Column()
  @Length(1, 17)
  mac: string;

  @Column()
  @Length(1, 64)
  cpu: string;

  @Column()
  @Length(1, 64)
  memory: string;

  @Column()
  @Length(1, 64)
  video: string;

  @Column()
  @IsInt()
  score: number;

  @Column()
  @Length(1, 1024)
  desc: string;

  @Column()
  @IsInt()
  isRegist: number;

  @Column({ type: 'datetime' })
  created: Date;

  @Column({ type: 'datetime' })
  modified: Date;
}
