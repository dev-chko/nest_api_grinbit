import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { Payment } from './payment.entity';

@ApiTags('24. payment')
@ApiBearerAuth('access-token')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService, // private readonly pointService: PointService,
  ) {}

  @Post('/result/:mIdx')
  async create(@Res() response, @Body() payment: Payment) {
    try {
      const create = await this.paymentService.create(payment);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Payment history create',
        data: { pIdx: create.pIdx },
      });
    } catch (e) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: e.message,
        error: 'Bad Request',
      });
    }
  }

  @Post('/verification')
  async Verification(@Res() response, @Body() data): Promise<any> {
    try {
      const { imp_uid, merchant_uid } = data;
      const getToken = await this.paymentService.getVerification();

      const getResult = await this.paymentService.getReceipt(
        getToken,
        imp_uid,
        merchant_uid,
      );
      return response.status(HttpStatus.OK).json({
        ...getResult.data,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: `${err}`,
      });
    }
  }

  @Get('status/:pIdx')
  async findGetOne(
    @Res() response,
    @Param('pIdx') pIdx: number,
  ): Promise<Payment> {
    try {
      const data = await this.paymentService.findByPidx(pIdx);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Payment get history',
        data: data,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'Bad Request',
      });
    }
  }

  @Get(':mIdx')
  async findPersonAll(
    @Res() response,
    @Param('mIdx') mIdx: number,
  ): Promise<Payment> {
    try {
      const data = await this.paymentService.findAll(mIdx);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Payment get history',
        data: data,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'Bad Request',
      });
    }
  }

  @Post('/success')
  async saveReceipt(@Res() response, @Body() data): Promise<any> {
    try {
      const savePayment = await this.paymentService.createReceipt(data);

      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Create Receipt',
        data: { ...savePayment },
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: `${err}`,
      });
    }
  }
}
