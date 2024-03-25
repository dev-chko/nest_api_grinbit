import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { createHash } from 'crypto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly HttpService: HttpService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // public async register(user: User) {
  //   //
  //   const hashedPassword = user.pw;
  //   try {
  //     const createdUser = await this.userService.createUser({
  //       ...user,
  //     });
  //     return createdUser;
  //   } catch (error) {
  //     throw new HttpException(
  //       'Something went wrong',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  public async login(username: string, password: string): Promise<any> {
    try {
      const user: User = await this.userService.findOneByEmail(username);
      if (!user) {
        throw new UnauthorizedException();
      }
      const isMatched = await this.verifyPassword(
        password,
        user.pw,
        user.pwKey,
      );
      if (!isMatched) {
        throw new UnauthorizedException();
      }

      //
      const accessToken = this.jwtService.sign({
        mIdx: user.mIdx,
        username,
      });
      const refreshToken = this.jwtService.sign(
        {
          mIdx: user.mIdx,
          username,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_REFRESH_EXPIRATION,
        },
      );

      user.pw = undefined;
      user.pwKey = undefined;
      user.emailAuthCode = undefined;
      user.googleOtpKeyStr = undefined;
      user['accessToken'] = accessToken;
      user['refreshToken'] = refreshToken;
      await this.userService.setRefreshToken(user.mIdx, refreshToken);
      return user;
    } catch (error) {
      console.log('error :>> ', error);
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async signUpUser(inputData: object): Promise<any> {
    const signup_url = 'https://cms.grinbit.io:8443/api/v1/user/signup';

    const { data } = await firstValueFrom(
      this.HttpService.post<any>(signup_url, inputData).pipe(
        catchError((error) => {
          throw `Signup Axios Error, ${error}`;
        }),
      ),
    );
    if (data.result === 'FAIL') {
      throw 'Signup Error(service)';
    }
    return data;
  }

  private async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
    pwKey: string,
  ) {
    const hashedNew = createHash('sha256')
      .update(pwKey + plainPassword, 'utf-8')
      .digest('base64');
    if (hashedPassword === hashedNew) {
      return true;
    }
    return false;
  }

  public async smsSend(inputData: object): Promise<any> {
    const sendSmsUrl = 'https://cms.grinbit.io:8443/api/v1/user/sms';
    const { data } = await firstValueFrom(
      this.HttpService.post<any>(sendSmsUrl, inputData).pipe(
        catchError((err) => {
          throw `Send SMS Code Error  ${err}`;
        }),
      ),
    );
    if (data.reason === '400') {
      throw `SMS Code Send Service Error`;
    }
    return data;
  }

  public async smsCheckSum(inputData: object): Promise<any> {
    const sendCheckurl = 'https://cms.grinbit.io:8443/api/v1/user/sms/check';
    const { data } = await firstValueFrom(
      this.HttpService.post<any>(sendCheckurl, inputData).pipe(
        catchError((err) => {
          throw `Send SMS Code Error  ${err}`;
        }),
      ),
    );
    if (data.data === false) {
      return { statusCode: 204, message: 'SMS Check Fail', data: false };
    }
    return { statusCode: 200, message: 'SMS Check successfully', data: true };
  }

  public async logout(mIdx: number) {
    await this.userService.removeRefreshToken(mIdx);
  }

  public async passwordCheck(data: any) {
    const user: User = await this.userService.findOneByEmail(data.username);
    const isVerifyPassword = await this.verifyPassword(
      data.password,
      user.pw,
      user.pwKey,
    );
    if (isVerifyPassword === false) {
      return { statusCode: 204, message: 'UnVerify Password', data: false };
    }
    return { statusCode: 200, message: 'Verify Password', data: true };
  }

  public async secessionUser(data: any) {
    const user: User = await this.userService.findOneByEmail(data.username);
    const isVerifyPassword = await this.verifyPassword(
      data.password,
      user.pw,
      user.pwKey,
    );
    if (isVerifyPassword === false) {
      return { statusCode: 204, message: 'not use user info', data: false };
    }
    const editUserInfo = await this.userService.secessionUser(data.username);
    if (editUserInfo) {
      return {
        statusCode: 200,
        message: 'Complete Secession User',
        data: true,
      };
    } else {
      throw new HttpException('User Secession Error', HttpStatus.BAD_REQUEST);
    }
  }

  public async refoundSMS(inputData: any) {
    const userData = await this.userRepository.findOne({
      where: { email: inputData.id, mobile: inputData.smsRecipient },
    });
    console.log('userData :>> ', userData);
    if (userData == null) {
      return new HttpException('User Not found', HttpStatus.BAD_REQUEST);
    } else {
      const sendSmsUrl = 'https://cms.grinbit.io/api/v1/user/sms';
      const { data } = await firstValueFrom(
        this.HttpService.post<any>(sendSmsUrl, inputData).pipe(
          catchError((err) => {
            throw `Send SMS Code Error  ${err}`;
          }),
        ),
      );
      if (data.reason === '400') {
        throw `SMS Code Send Service Error`;
      }
      console.log('data :>> ', data);
      return data;
    }
  }

  public async refoundSmsCheck(inputData: any) {
    const smsCheckUrl = 'https://cms.grinbit.io/api/v1/user/sms/check';
    const { data } = await firstValueFrom(
      this.HttpService.post<any>(smsCheckUrl, inputData).pipe(
        catchError((err) => {
          throw `Send SMS Code Error  ${err}`;
        }),
      ),
    );
    if (data.reason === '400') {
      throw `SMS Code Send Service Error`;
    }
    console.log('data :>> ', data);
    return data;
  }

  public async changePassWord(inputData: any) {
    const SubmitUrl = 'https://localhost:8443/api/v1/user/resetpw';
    const { data } = await firstValueFrom(
      this.HttpService.post<any>(SubmitUrl, inputData).pipe(
        catchError((err) => {
          throw `Send API ERROR ${err}`;
        }),
      ),
    );
    if (data.reason === '400') {
      throw `Reset password error`;
    }
    console.log(`data:>>`, data);
    return data;
  }
}
