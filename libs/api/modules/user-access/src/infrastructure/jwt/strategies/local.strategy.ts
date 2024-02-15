import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER, WinstonLogger } from '@owl-app/winston-logger-nestjs'

import { JwtTokenService } from '../services/jwt.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: WinstonLogger
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    if (!email || !password) {
      this.logger.warn('LocalStrategy', `Email or password is missing`);
      throw new UnauthorizedException();
    }
    const user = await this.jwtTokenService.validateUserForLocalStragtegy(email, password);
    if (!user) {
      this.logger.warn('LocalStrategy', `Invalid email or password`);
      throw new UnauthorizedException({ message: 'Invalid email or password.' });
    }
    return user;
  }
}
