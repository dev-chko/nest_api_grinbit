import {
  Controller,
  Body,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';

import { UserService } from './user.service';
import { User } from './user.entity';
import { Point } from 'src/point/point.entity';
import { Public } from '../auth/skipAuth.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('2. users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {
    this.userService = userService;
  }

  @Public()
  @Get('/check/:email')
  async checksumEmail(
    @Res() response,
    @Param('email') email: string,
  ): Promise<string> {
    try {
      const data = await this.userService.checkMail(email);
      return response.status(HttpStatus.OK).json({
        ...data,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'Bad Request',
      });
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({
    description: '사용자 정보를 입력한다.',
    examples: {
      'input-user': {
        summary: 'input user info.',
        value: {
          name: 'name',
          email: 'email@gmail.com',
          pw: 'pw123456',
          pwKey: 'pwKey',
          mobile: 'mobile',
          emailAuth: '1',
          emailAuthCode: 'emailAuthCode',
          mobileAuth: '1',
          googleOtpUsed: '1',
          googleOtpKeyStr: 'googleOtpKeyStr',
          refreshToken: '',
        },
      },
    },
  })
  async createUser(@Res() response, @Body() user: User): Promise<string> {
    try {
      const newUser = await this.userService.createUser(user);
      return response.status(HttpStatus.CREATED).json({
        statusCode: 201,
        message: 'User created successfully',
        data: newUser,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'Bad Request',
      });
    }
  }

  @Get()
  async findAll(@Res() response): Promise<User[]> {
    try {
      const userList = await this.userService.findAll();
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: `All users data found successfully`,
        data: userList,
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
  async findOne(@Res() response, @Param('mIdx') mIdx: number): Promise<User> {
    try {
      // const foundUser = await this.userService.findOne(mIdx);
      const foundUser = await this.userService.findOneWithPoint(mIdx);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: `User found successfully`,
        data: foundUser,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'Bad Request',
      });
    }
  }

  @Put(':mIdx')
  @ApiBody({
    description: '사용자 정보를 입력한다.',
    examples: {
      'input-user': {
        summary: 'input user info.',
        value: {
          name: 'name',
          email: 'email@gmail.com',
          pw: 'pw123456',
          pwKey: 'pwKey',
          mobile: 'mobile',
          emailAuth: '1',
          emailAuthCode: 'emailAuthCode',
          mobileAuth: '1',
          googleOtpUsed: '1',
          googleOtpKeyStr: 'googleOtpKeyStr',
          refreshToken: '',
        },
      },
    },
  })
  async saveUser(
    @Res() response,
    @Param('mIdx') mIdx: number,
    @Body() user: User,
  ): Promise<string> {
    try {
      const updateUser = await this.userService.saveUser(mIdx, user);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: `saved successfully`,
        data: { ...updateUser },
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'Bad Request',
      });
    }
  }

  @Delete(':mIdx')
  async deleteUser(
    @Res() response,
    @Param('mIdx') mIdx: number,
  ): Promise<string> {
    try {
      await this.userService.remove(mIdx);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: `User deleted successfully`,
        data: { mIdx },
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'Bad Request',
      });
    }
  }

  @Public()
  @Post('finduser')
  async findUser(@Body() data, @Res() response): Promise<any> {
    const { mobile } = data;
    try {
      const returnData = await this.userService.findMailForMobile(mobile);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'Find user Data OK',
        data: returnData.email,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Find user ID Error',
        data: err,
      });
    }
  }
}
