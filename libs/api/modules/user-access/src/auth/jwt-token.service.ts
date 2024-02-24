import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { type IJwtConfig } from '@owl-app/lib-api-bulding-blocks/config/jwt';
import { IJwtTokenService, IJwtServicePayload } from '@owl-app/lib-api-bulding-blocks/passport/jwt-token.interface';

import { User } from '../domain/model/user'
import { IUserRepository } from '../database/repository/user-repository.interface';

@Injectable()
export default class JwtTokenService implements IJwtTokenService<User> {
  constructor( 
    private readonly jwtConfig: IJwtConfig,
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
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

  async validateToken(pass: string, passwordHash: string): Promise<boolean> {
    if (await bcrypt.compare(pass, passwordHash)) {
      return true;
    }

    return false;
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

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.hashRefreshToken
    );
    if (isRefreshTokenMatching) {
      return user;
    }

    return null;
  }

  private async setCurrentRefreshToken(refreshToken: string, email: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    
    await this.userRepository.updateRefreshToken(
      email,
      currentHashedRefreshToken
    );
  }
}

