import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER, WinstonLogger } from '@owl-app/winston-logger-nestjs'
import { IUser } from '@owl-app/lib-contracts';

import { JwtTokenService } from '../services/jwt.service';
import { JWT_CONFIG } from '../../providers/jwt-config.provider';

import { type IJwtConfig } from '../../../domain/config/jwt-config.interface';
import { IJwtService } from '../../../domain/services/jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(IJwtService)
    private readonly jwtTokenService: JwtTokenService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: WinstonLogger,
    @Inject(JWT_CONFIG)
    private jwtConfig: IJwtConfig
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: any): Promise<IUser> {
    const user = await this.jwtTokenService.validateUserForJWTStragtegy(payload.email);

    if (!user) {
      this.logger.warn('JwtStrategy', `User not found`);
      throw new UnauthorizedException({ message: 'User not found' });
    }
    return user;
  }
}
