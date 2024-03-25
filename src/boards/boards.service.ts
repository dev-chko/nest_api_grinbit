import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boards } from './boards.entity';
import { BoardsReply } from 'src/boards_reply/boards_reply.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Boards)
    private boardsRepository: Repository<Boards>,
    @InjectRepository(BoardsReply)
    private readonly boardsReplyRepository: Repository<BoardsReply>,
  ) {}

  async create(boards: Boards): Promise<Boards> {
    new Boards();
    const newBoards = this.boardsRepository.create(boards);
    return this.boardsRepository.save(newBoards);
  }

  async findAll(category: string): Promise<Boards[]> {
    return await this.boardsRepository.find();
  }

  async findOne(bIdx: number): Promise<Boards> {
    return await this.boardsRepository.findOne({
      where: { bIdx },
    });
  }

  async findByAllmIdx(mIdx: number): Promise<any> {
    const reply = await this.boardsRepository
      .createQueryBuilder('boards')
      .leftJoinAndSelect('boards.replies', 'replies')
      .where('boards.writerIdx = :writerIdx', { writerIdx: mIdx })
      .getMany();
    return reply;
  }

  async findPage(
    category: string = 'notice',
    perPage: number = 20,
    page: number = 1,
    sort: string = 'DESC',
  ) {
    const topList = await this.boardsRepository.find({
      where: {
        category: category,
        // isPublic: true,
        isTopDisplay: true,
      },
      order: {
        created: sort.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
      },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    const condition = {
      category: category,
      // isPublic: true,
      isTopDisplay: false,
    };
    const [list, count] = await Promise.all([
      this.boardsRepository.find({
        where: condition,
        order: {
          created: sort.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
        },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.boardsRepository.count({
        where: condition,
      }),
    ]);

    return { boardsList: [...topList, ...list], totalCount: count || 0 };
  }

  async save(bIdx: number, boards: Boards): Promise<Boards> {
    // TODO: update() 호출로 변경할 것.
    let newBoards = await this.boardsRepository.findOne({
      where: { bIdx },
    });

    newBoards = { ...newBoards, ...boards };

    return await this.boardsRepository.save(newBoards);
  }

  async updateReadCount(bIdx: number): Promise<Boards> {
    // TODO: update() 호출로 변경할 것.
    // return await this.boardsRepository.update(
    //   { where: { bIdx } },
    //   { readCount: () => 'readCount + 1' },
    // );
    const boards = await this.boardsRepository.findOne({ where: { bIdx } });
    if (boards) {
      boards.readCount++;
    }

    return await this.boardsRepository.save(boards);
  }

  async remove(bIdx: number): Promise<void> {
    await this.boardsRepository.delete(bIdx);
  }
}
