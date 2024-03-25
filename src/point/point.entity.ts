import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
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

import { User } from 'src/user/user.entity';

@Entity({
  name: 'tb_cloud_point',
  engine: 'InnoDB',
  database: 'cloudpc',
  schema: 'tb_cloud_point',
  synchronize: false,
  orderBy: {
    pIdx: 'ASC',
  },
})
export class Point {
  @PrimaryGeneratedColumn()
  pIdx: number;

  @PrimaryColumn()
  mIdx: number;

  @Column('int')
  balance: number;

  @Column({ type: 'datetime' })
  created: Date;

  @Column({ type: 'datetime' })
  modified: Date;

  @OneToOne(() => User, (user) => user)
  user: User;

  // @ManyToOne(() => User, (user) => user)
  // mIdx: User;
}
