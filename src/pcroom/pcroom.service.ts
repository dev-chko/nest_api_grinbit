import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { PCRoom } from './pcroom.entity';

@Injectable()
export class PCRoomService {
  constructor(
    @InjectRepository(PCRoom)
    private pcRoomRepository: Repository<PCRoom>,
  ) {}

  async create(pcroom: PCRoom): Promise<PCRoom> {
    const newRoom = this.pcRoomRepository.create(pcroom);
    return this.pcRoomRepository.save(newRoom);
  }

  async findAll(): Promise<PCRoom[]> {
    return await this.pcRoomRepository.find();
  }

  async findOne(rIdx: number): Promise<PCRoom> {
    return await this.pcRoomRepository.findOne({
      where: { rIdx },
    });
  }

  async save(rIdx: number, boards: PCRoom): Promise<PCRoom> {
    // TODO: update() 호출로 변경할 것.
    let updateRoom = await this.pcRoomRepository.findOne({
      where: { rIdx },
    });

    updateRoom = { ...updateRoom, ...boards };

    return await this.pcRoomRepository.save(updateRoom);
  }

  async remove(rIdx: number): Promise<void> {
    await this.pcRoomRepository.delete(rIdx);
  }
}
