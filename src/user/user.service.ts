import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { Point } from 'src/point/point.entity';

import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
  ) {}

  async createUser(user: User): Promise<User> {
    // TODO: wallet서버에 요청하여 사용자 등록후 저장할 것.

    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(mIdx: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { mIdx },
    });
  }

  async findOneWithPoint(mIdx: number): Promise<any> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.point', 'point')
      .where('user.mIdx = :mIdx', { mIdx: mIdx })
      .getOne();
    return users;
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async saveUser(mIdx: number, user: User): Promise<User> {
    // TODO: wallet서버 변경후 수정할 것.

    let updateUser = await this.userRepository.findOne({
      where: { mIdx },
    });

    if (updateUser) {
      updateUser = { ...updateUser, ...user };

      return await this.userRepository.save(updateUser);
    } else {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(mIdx: number): Promise<void> {
    // TODO: wallet서버 변경후 수정할 것.
    // const newUser = this.userRepository.create(user);
    await this.userRepository.delete(mIdx);
  }

  // refreshToken
  async setRefreshToken(mIdx: number, refreshToken: string) {
    await this.userRepository.update(mIdx, { refreshToken });
  }

  async getUserIfRefreshTokenMatches(mIdx: number, refreshToken: string) {
    const user = await this.findOne(mIdx);
    if (user.refreshToken === refreshToken) {
      return user;
    }

    if (
      process.env.NODE_ENV === 'development' &&
      process.env.SWAGGER_REFRESH_TOKEN === refreshToken
    ) {
      return user;
    }
  }

  async removeRefreshToken(mIdx: number) {
    await this.userRepository.update(mIdx, { refreshToken: null });
  }

  public async checkMail(email: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (user) {
      return { statusCode: 204, message: 'useing email', data: false };
    }
    return { statusCode: 200, message: 'Checksum Email Ok', data: true };
  }

  public async findMailForMobile(mobile: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { mobile },
    });
    if (!user) {
      return { message: 'Not Found Email' };
    }
    return user;
  }

  public async secessionUser(email: string): Promise<any> {
    let findUser = await this.userRepository.findOne({
      where: { email },
    });
    if (findUser) {
      findUser = { ...findUser, email: uuid(), mobile: '00000000' };
      const userInfo = await this.userRepository.save(findUser);
      if (userInfo) {
      }
      return { statusCode: 200, message: 'SecessionUser Compelte', data: true };
    } else {
      throw new HttpException('Secession User Error', HttpStatus.BAD_REQUEST);
    }
  }
}
