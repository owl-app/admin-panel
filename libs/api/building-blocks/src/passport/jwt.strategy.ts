import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'

import { AuthUserData, Permission, User } from '@owl-app/lib-contracts';
import { Manager } from '@owl-app/rbac-manager';

import { JWT_CONFIG_PROVIDER, type IJwtConfig } from '../config/jwt'
import { IJwtTokenPayload, IJwtTokenService } from './jwt-token.interface';
import { extractJWT } from './extract-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(JWT_CONFIG_PROVIDER)
    private jwtConfig: IJwtConfig,
    @Inject(IJwtTokenService)
    private jwtTokenService: IJwtTokenService<User>,
    @Inject('RBAC_MANAGER')
    readonly rbacManager: Manager
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractJWT('access_token'),
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: IJwtTokenPayload): Promise<Partial<AuthUserData>> {
    const user = await this.jwtTokenService.validateUserForJWTStragtegy(payload.email);

    if (!user) {
      throw new UnauthorizedException();
    }

    return { 
      id: user.id,
      username: user.username,
      email: user.email,
      tenant: user.tenant,
      roles: (await this.rbacManager.getRolesByUserId(user.id)).map(role => role.name),
      permissions: Object.keys(await this.rbacManager.getPermissionsByUserId(user.id)),
    };
  }
}
