import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { PointService } from 'src/point/point.service';
import { Point } from 'src/point/point.entity';
import { GoodsService } from 'src/goods/goods.service';
import { Goods } from 'src/goods/goods.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private HttpService: HttpService,
    @InjectRepository(Point)
    private pointRepository: Repository<Point>,
    @InjectRepository(Goods)
    private goodsRepository: Repository<Goods>,
  ) {}

  async findAll(mIdx: number): Promise<Payment[]> {
    const payments = await this.paymentRepository.find({
      where: { mIdx: mIdx },
      order: {
        created: 'DESC',
      },
    });

    for (const payment of payments) {
      if (payment.gIdx) {
        const goods = await this.goodsRepository.findOne({
          where: { gIdx: payment.gIdx },
        });
        payment.goods = goods;
      }
    }
    return payments;
  }

  async findByPidx(pIdx: number): Promise<Payment> {
    return await this.paymentRepository.findOne({
      where: { pIdx },
    });
  }

  async create(payment: Payment): Promise<Payment> {
    const newPayment = await this.paymentRepository.create(payment);
    return await this.paymentRepository.save(newPayment);
  }

  async getVerification(): Promise<any> {
    const tokenUrl = 'https://api.iamport.kr/users/getToken';
    const rest_data = {
      imp_key: process.env.IAMPORT_KEY,
      imp_secret: process.env.IAMPORT_SECRET,
    };
    const getToken = await firstValueFrom(
      this.HttpService.post<any>(tokenUrl, rest_data).pipe(
        catchError((error) => {
          throw `getTokenError,${error.message}`;
        }),
      ),
    );
    const access_token = getToken.data.response.access_token;
    return access_token;
  }

  async getReceipt(token, imp_uid, merchant_uid): Promise<any> {
    try {
      const getPaymentUrl = `https://api.iamport.kr/payments/${imp_uid}`;
      const config = { headers: { Authorization: token } };
      const getResult = await firstValueFrom(
        this.HttpService.get<any>(getPaymentUrl, config).pipe(
          catchError((error) => {
            throw error;
          }),
        ),
      );
      return getResult;
    } catch (error) {}
  }

  async createReceipt(data: Payment): Promise<Payment> {
    const goods = await this.goodsRepository.findOne({
      where: { gIdx: data.gIdx },
    });

    if (!goods) {
      throw new ForbiddenException(
        '상품정보가 없어 결제정보를 저장할 수 없습니다.',
      );
    }

    // 포인트 적립 : 레코드가 없으면 생성, 있으면 누적
    const paidAmount = goods.amount;
    let point = await this.pointRepository.findOne({
      where: { mIdx: data.mIdx },
    });

    //
    if (!point) {
      point = new Point();
      point.mIdx = data.mIdx;
      point.balance = parseInt(paidAmount);
    } else {
      point.balance += parseInt(paidAmount);
    }

    const savePoint = await this.pointRepository.save(point);
    if (!savePoint) {
      throw new ForbiddenException('포인트 적립에 실패했습니다.');
    }

    return await this.paymentRepository.save(data);
  }
}
