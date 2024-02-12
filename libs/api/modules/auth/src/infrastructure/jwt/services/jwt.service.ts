import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '@owl-app/lib-contracts';

import { IJwtService, IJwtServicePayload } from '../../../domain/services/jwt.interface';
import { IBcryptService } from '../../../domain/services/bcrypt.interface';
import { IJwtConfig } from '../../../domain/config/jwt-config.interface';

@Injectable()
export class JwtTokenService<User = IUser> implements IJwtService<User> {
  constructor( 
    private readonly jwtConfig: IJwtConfig,
    private readonly jwtService: JwtService,
    private readonly bcryptService: IBcryptService
  ) {}

  async checkToken(token: string): Promise<any> {
    const decode = await this.jwtService.verifyAsync(token);
    return decode;
  }

  createToken(payload: IJwtServicePayload, secret: string, expiresIn: string): string {
    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }

  async getJwtToken(email: string): Promise<string> {
    const payload: IJwtServicePayload = { email };
    const secret = this.jwtConfig?.secret;
    const expiresIn = `${this.jwtConfig.expiration_time}s`;
    const token = this.createToken(payload, secret, expiresIn);

    return token;
  }

  async getJwtRefreshToken(email: string): Promise<string> {
    const payload: IJwtServicePayload = { email };
    const secret = this.jwtConfig.refresh_token_secret;
    const expiresIn = `${this.jwtConfig.refresh_token_expiration_time}s`;
    const token = this.createToken(payload, secret, expiresIn);

    await this.setCurrentRefreshToken(token, email);

    return token;
  }

  async validateUserForLocalStragtegy(email: string, pass: string): Promise<User|null> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      return null;
    }

    const match = await this.bcryptService.compare(pass, user.passwordHash);

    if (user && match) {
      await this.updateLoginTime(user.email);
      const { passwordHash, ...result } = user;
      return result;
    }

    return null;
  }

  async validateUserForJWTStragtegy(email: string): Promise<User|null> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      return null;
    }
    return user;
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, email: string): Promise<User|null> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const isRefreshTokenMatching = await this.bcryptService.compare(
      refreshToken,
      user.hashRefreshToken
    );
    if (isRefreshTokenMatching) {
      return user;
    }

    return null;
  }

  private async updateLoginTime(email: string): Promise<void> {
    await this.userRepository.updateLastLogin(email);
  }

  private async setCurrentRefreshToken(refreshToken: string, email: string) {
    const currentHashedRefreshToken = await this.bcryptService.hash(
      refreshToken
    );
    await this.userRepository.updateRefreshToken(
      email,
      currentHashedRefreshToken
    );
  }
}

