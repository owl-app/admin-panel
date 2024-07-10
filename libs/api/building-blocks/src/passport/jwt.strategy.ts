import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'

import { JWT_CONFIG_PROVIDER, type IJwtConfig } from '../config/jwt'
import { IJwtTokenPayload, IJwtTokenService } from './jwt-token.interface';
import { User } from '@owl-app/lib-contracts';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(JWT_CONFIG_PROVIDER)
    private jwtConfig: IJwtConfig,
    @Inject(IJwtTokenService)
    private jwtTokenService: IJwtTokenService<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: IJwtTokenPayload): Promise<Partial<User>> {
    const user = await this.jwtTokenService.validateUserForJWTStragtegy(payload.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    return { 
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }
}
