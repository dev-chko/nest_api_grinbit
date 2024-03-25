import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
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

import { Point } from 'src/point/point.entity';
import { profile } from 'console';
import { OneToMany } from 'typeorm';
@Entity({
  name: 'tb_cloud_user',
  engine: 'InnoDB',
  database: 'cloudpc',
  schema: 'tb_cloud_user',
  synchronize: false,
  orderBy: {
    mIdx: 'ASC',
  },
})
export class User {
  @PrimaryGeneratedColumn()
  mIdx: number;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('varchar', { length: 128 })
  @IsEmail()
  email: string;

  @Column('varchar', { length: 100 })
  @Length(8, 100)
  pw: string;

  @Column()
  @Length(1, 255)
  pwKey: string;

  @Column()
  @Length(1, 20)
  mobile: string;

  @Column()
  @Length(1, 1)
  emailAuth: string;

  @Column()
  @Length(1, 2551)
  emailAuthCode: string;

  @Column()
  @Length(1, 1)
  mobileAuth: string;

  @Column()
  @Length(1, 1)
  googleOtpUsed: string;

  @Column()
  @Length(1, 100)
  googleOtpKeyStr: string;

  @Column()
  refreshToken: string;

  @Column({ type: 'datetime' })
  created: Date;

  @Column({ type: 'datetime' })
  modified: Date;

  @Column()
  role: string;

  @OneToOne(() => Point, (point) => point.mIdx)
  @JoinColumn({ name: 'mIdx' })
  point: Point;
}
