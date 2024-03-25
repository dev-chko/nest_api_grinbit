import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    const authorization = req.headers?.authorization;
    if (authorization && authorization.substr(0, 7) === 'Bearer ') {
      const refreshToken = authorization.split(' ')[1];
      if (refreshToken.length > 0) {
        const user = await this.userService.getUserIfRefreshTokenMatches(
          payload.mIdx,
          refreshToken,
        );

        if (user) {
          return {
            accessToken: this.jwtService.sign({
              mIdx: user.mIdx,
              username: user.email,
            }),
            refreshToken: refreshToken,
          };
        }
      }
    }
  }
}
