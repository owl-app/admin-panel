import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER, WinstonLogger } from '@owl-app/winston-logger-nestjs'

import { IUser } from '@owl-app/lib-contracts';

import { IJwtTokenService } from '@owl-app/lib-api-bulding-blocks/passport/jwt-token.interface'
import { loginValidation } from '../features/login/validation';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(IJwtTokenService)
    private readonly jwtTokenService: IJwtTokenService<IUser>,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: WinstonLogger
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    await loginValidation.validateAsync({email, password}, { abortEarly: false });
  
    const user = await this.jwtTokenService.validateUserForLocalStragtegy(email, password);
    if (!user) {
      this.logger.warn('LocalStrategy', `Invalid email or password`);
      throw new UnauthorizedException({ message: 'Invalid email or password.' });
    }
    return user;
  }
}
