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

@Entity({
  name: 'tb_cloud_goods',
  engine: 'InnoDB',
  database: 'cloudpc',
  schema: 'tb_cloud_goods',
  synchronize: false,
  orderBy: {
    gIdx: 'ASC',
  },
})
export class Goods {
  @PrimaryGeneratedColumn()
  gIdx: number;

  @Column('varchar', { length: 45 })
  name: string;

  @Column('varchar', { length: 45 })
  amount: string;

  @Column('varchar', { length: 45 })
  point: string;

  @Column({ type: 'datetime' })
  created: Date;

  @Column({ type: 'datetime' })
  modified: Date;

  // @OneToOne(() => User, (user) => user)
  // user: User;

  // @ManyToOne(() => User, (user) => user)
  // mIdx: User;
}
