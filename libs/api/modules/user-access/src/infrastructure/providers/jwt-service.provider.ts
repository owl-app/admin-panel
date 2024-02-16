import { JwtService } from '@nestjs/jwt';

import { IJwtService } from '../../domain/services/jwt.interface'

import { JWT_CONFIG } from './jwt-config.provider';
import { JwtTokenService } from "../jwt/services/jwt.service";
import { BcryptService } from '../services/bcrypt.service';

import { type IJwtConfig } from '../../domain/config/jwt-config.interface';
import { IUserRepository } from '../../domain/repository/user-repository.interface';

export const jwtServiceProvider = {
  inject: [JWT_CONFIG, IUserRepository, JwtService, BcryptService],
  provide: IJwtService,
  useFactory: (
    config: IJwtConfig,
    userRepository: IUserRepository,
    jwtService: JwtService,
    bcryptService: BcryptService
  ) => new JwtTokenService(config, userRepository, jwtService, bcryptService),
}