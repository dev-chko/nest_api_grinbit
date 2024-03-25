import {
  Body,
  Req,
  Controller,
  Post,
  UseGuards,
  HttpStatus,
  Res,
  Get,
} from '@nestjs/common';
import { LocalAuthGuard } from './localAuth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiHeader,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
// import RegisterDto from './dto/register.dto';
import RequestWithUser from './requestWithUser.interface';
import { Public } from './skipAuth.decorator';
import { JwtRefreshGuard } from './jwtRefresh.guard';
import { response } from 'express';

@ApiTags('1. auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * /auth/signup
   *
   * @param request
   * @param response
   */
  @Public()
  @Post('signup')
  async signUpUser(@Body() data, @Res() response): Promise<any> {
    try {
      const responseData = await this.authService.signUpUser(data);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'signup successfully',
        data: { ...responseData },
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'signup error(controller)',
      });
    }
  }

  /**
   * /auth/login
   *
   * @param request
   * @param response
   * @returns
   */
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: '사용자 로그인 API',
    description: '로그인을 수행한다.',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBody({
    description: 'username과 password 필드를 설정한다.',
    examples: {
      testAccount: {
        summary: '.env Account',
        value: {
          username:
            process.env.NODE_ENV === 'development'
              ? process.env.SWAGGER_USERNAME
              : '',
          password:
            process.env.NODE_ENV === 'development'
              ? process.env.SWAGGER_PASSWORD
              : '',
        },
      },
    },
  })
  async login(@Req() request: RequestWithUser, @Res() response) {
    try {
      const { user } = request;
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'login success',
        data: { ...user },
      });
    } catch (err) {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: 401,
        message: err.message,
        error: 'Unauthorized',
      });
    }
  }

  /**
   * /auth/logout
   *
   * @param request
   * @param response
   */
  @Get('logout')
  @ApiOperation({
    summary: '사용자 로그아웃 API',
    description: '로그아웃을 수행한다.',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async logout(@Req() request: RequestWithUser, @Res() response) {
    const { user } = request;
    await this.authService.logout(user.mIdx);

    return response.status(HttpStatus.OK).json({
      statusCode: 200,
      message: 'logout success',
      data: { mIdx: user.mIdx },
    });
  }

  /**
   * /auth/profile
   *
   * @param request
   * @returns
   */
  @Get('profile')
  @ApiOperation({
    summary: '사용자 프로필 API',
    description: '사용자 프로필을 읽는다.',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  getProfile(@Req() request, @Res() response) {
    const { user } = request;

    return response.status(HttpStatus.OK).json({
      statusCode: 200,
      message: 'get profile success',
      data: { ...user },
    });
  }

  /**
   * /auth/refresh
   *
   * @param request
   * @param response
   * @returns
   */
  @Public()
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  @ApiOperation({
    summary: '토큰 갱신 API',
    description: 'refreshToken을 전송하여 새로운 토큰을 얻는다.',
  })
  @ApiBearerAuth('refresh-token')
  @ApiResponse({ status: 200 })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  // 설정이 안되어 잠시 remark처리
  // @ApiHeader({
  //   name: 'Authorization',
  //   description: 'Bearer refresh-token',
  //   required: true,
  // })
  async refreshToken(@Req() request: RequestWithUser, @Res() response) {
    try {
      const token = request.user;

      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'refresh success',
        data: token,
      });
    } catch (err) {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: 401,
        message: err.message,
        error: 'Unauthorized',
      });
    }
  }

  @Public()
  @ApiOperation({
    summary: 'SMS 인증',
    description: '핸드폰 인증에 사용',
  })
  @ApiResponse({ status: 200 })
  @Post('sms')
  async sendSms(@Body() data, @Res() response): Promise<any> {
    try {
      const responseData = await this.authService.smsSend(data);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'SMS Send successfully',
        data: { ...responseData },
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'Send SMS Service Error',
      });
    }
  }

  @Public()
  @ApiOperation({
    summary: 'SMS 인증 번호 확인',
    description: '핸드폰 인증에 번호 확인에 사용',
  })
  @ApiResponse({ status: 200 })
  @Post('sms/check')
  async checkSms(@Body() data, @Res() response): Promise<any> {
    try {
      const responseData = await this.authService.smsCheckSum(data);
      return response.status(HttpStatus.OK).json({
        ...responseData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'Check SMS Service Error',
      });
    }
  }

  @Public()
  @ApiOperation({
    summary: '비밀번호 재설정 SMS 인증',
    description: '비밀번호 재설정 핸드폰 인증',
  })
  @ApiResponse({ status: 200 })
  @Post('refound/sms')
  async refoundSms(@Body() data, @Res() response): Promise<any> {
    try {
      const responseData = await this.authService.refoundSMS(data);
      console.log('responseData :>> ', responseData);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'SMS Send Successfully',
        data: { ...responseData },
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'Send sms Service error',
      });
    }
  }

  @Public()
  @ApiOperation({
    summary: '비밀번호 재설정 SMS 인증',
    description: '비밀번호 재설정 핸드폰 인증',
  })
  @ApiResponse({ status: 200 })
  @Post('refound/sms/check')
  async refoundSmsCheck(@Body() data, @Res() response): Promise<any> {
    try {
      const responseData = await this.authService.refoundSmsCheck(data);
      console.log('responseData :>> ', responseData);
      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        message: 'SMS Check Successfully',
        data: { ...responseData },
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'SMS Check Service error',
      });
    }
  }

  @ApiOperation({
    summary: '비밀번호 확인',
    description: '회원 수정 및 탈퇴시 사용',
  })
  @ApiResponse({ status: 200 })
  @Post('checkpw')
  async checkPw(@Body() DataTransfer, @Res() response): Promise<any> {
    const { username, password } = DataTransfer;
    try {
      const responseData = await this.authService.passwordCheck({
        username: username,
        password: password,
      });
      return response.status(HttpStatus.OK).json({
        ...responseData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'Password Check Error',
      });
    }
  }

  @ApiOperation({
    summary: '회원탈퇴',
    description: '회원탈퇴시 회원 정보 수정',
  })
  @ApiResponse({ status: 200 })
  @Post('secession')
  async secessionUser(@Body() DataTransfer, @Res() response): Promise<any> {
    const { username, password } = DataTransfer;
    console.log('회원탈퇴 :>> ', DataTransfer);
    try {
      const responseData = await this.authService.secessionUser({
        username: username,
        password: password,
      });
      return response.status(HttpStatus.OK).json({
        ...responseData,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: err.message,
        error: 'User secession Error',
      });
    }
  }

  @Public()
  @Post('resetpw')
  async resetSendApi(@Body() DataTransfer, @Res() response): Promise<any> {
    try {
      const responseData = await this.authService.changePassWord(DataTransfer);
      return response.status(HttpStatus.OK).json({
        ...responseData,
      });
    } catch (err) {
      console.log('err :>> ', err);
      return response.status(HttpStatus.BAD_REQUEST).json({
        ...err,
      });
    }
  }
}
