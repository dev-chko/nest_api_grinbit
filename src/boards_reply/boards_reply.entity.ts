import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
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
import { Boards } from 'src/boards/boards.entity';

@Entity({
  name: 'tb_cloud_board_reply',
  engine: 'InnoDB',
  database: 'cloudpc',
  schema: 'tb_cloud_board_reply',
  synchronize: false,
  orderBy: {
    brIdx: 'DESC',
  },
})
export class BoardsReply {
  @PrimaryGeneratedColumn()
  brIdx: number;

  @Column()
  bIdx: number;

  @Column()
  writer: string;

  @Column()
  content: string;

  @Column({ type: 'datetime' })
  created: Date;

  @ManyToOne(() => Boards, (board) => board.replies)
  @JoinColumn({ name: 'bIdx' })
  boards: Boards;
}
