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

// import { User } from 'src/user/user.entity';
import { Point } from 'src/point/point.entity';
import { Goods } from 'src/goods/goods.entity';

@Entity({
  name: 'tb_cloud_payment',
  engine: 'InnoDB',
  database: 'cloudpc',
  schema: 'tb_cloud_payment',
  synchronize: false,
  orderBy: {
    pIdx: 'ASC',
  },
})
export class Payment {
  @PrimaryGeneratedColumn()
  pIdx: number;

  @PrimaryColumn()
  merchant_uid: string;

  @PrimaryColumn()
  mIdx: number;

  @PrimaryColumn()
  gIdx: number;

  @Column({ nullable: false })
  category: string;

  @Column('int')
  result: number;

  @Column({ type: 'datetime' })
  created: Date;

  // @OneToOne(() => User, (user) => user)
  // user: User;

  // @ManyToOne(() => User, (user) => user)
  // mIdx: User;

  @ManyToOne(() => Goods)
  @JoinColumn({ name: 'gIdx' })
  goods: Goods;
}
