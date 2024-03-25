import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { RemotePC } from './remotepc.entity';

@Injectable()
export class RemotePCService {
  constructor(
    @InjectRepository(RemotePC)
    private remotepcRepository: Repository<RemotePC>,
  ) {}

  async create(pcroom: RemotePC): Promise<RemotePC> {
    const newRoom = this.remotepcRepository.create(pcroom);
    return this.remotepcRepository.save(newRoom);
  }

  async findAll(): Promise<RemotePC[]> {
    return await this.remotepcRepository.find();
  }

  async findByRIdx(rIdx: number): Promise<RemotePC[]> {
    return await this.remotepcRepository.find({
      where: { rIdx, isRegist: 1 },
    });
  }

  async findOneByPCIdx(pcIdx: number): Promise<RemotePC> {
    return await this.remotepcRepository.findOne({
      where: { pcIdx },
    });
  }

  async findOneByIpMac(ip: string, mac: string): Promise<RemotePC> {
    return await this.remotepcRepository.findOne({
      where: { ip, mac, isRegist: 1 },
      order: { modified: 'DESC' },
    });
  }

  async findOne(pcIdx: number): Promise<RemotePC> {
    return await this.remotepcRepository.findOne({
      where: { pcIdx },
    });
  }

  async save(pcIdx: number, remotepc: RemotePC): Promise<RemotePC> {
    // TODO: update() 호출로 변경할 것.
    let update = await this.remotepcRepository.findOne({
      where: { pcIdx },
    });

    update = { ...update, ...remotepc };

    return await this.remotepcRepository.save(update);
  }

  async remove(pcIdx: number): Promise<DeleteResult> {
    const result = await this.remotepcRepository.delete(pcIdx);
    return result;
  }
}
