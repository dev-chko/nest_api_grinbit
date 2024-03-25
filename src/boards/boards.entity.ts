import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
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
import { BoardsReply } from '../boards_reply/boards_reply.entity';

@Entity({
  name: 'tb_cloud_board',
  engine: 'InnoDB',
  database: 'cloudpc',
  schema: 'tb_cloud_board',
  synchronize: false,
  orderBy: {
    bIdx: 'DESC',
  },
})
export class Boards {
  @PrimaryGeneratedColumn()
  bIdx: number;

  @Column('varchar', { length: 12 })
  @Length(1, 12)
  category: string;

  @Column('varchar', { length: 100 })
  @Length(1, 100)
  subject: string;

  @Column('longtext')
  @Length(1, 10 * 1024 * 1024)
  body: string;

  @Column('bigint')
  @IsInt()
  readCount: number;

  @Column('varchar', { length: 45 })
  @Length(1, 45)
  writer: string;

  @Column()
  writerIdx: number;

  @Column()
  isPublic: boolean;

  @Column()
  isTopDisplay: boolean;

  @Column({ type: 'datetime' })
  created: Date;

  @Column({ type: 'datetime' })
  modified: Date;

  @OneToMany(() => BoardsReply, (BoardsReply) => BoardsReply.boards)
  @JoinColumn({ name: 'bIdx' })
  replies: BoardsReply[];
}
