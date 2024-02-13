import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppRequestContextService } from '@owl-app/lib-api-bulding-blocks/infrastructure/context';

import { IUserFacade, UserFacade } from './user.facade';

import { IUserRepository } from '../domain';

import { UserRepository } from "../infrastructure/persistence/repository/user.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository])
  ],
  providers: [
    UserRepository,
    AppRequestContextService,
    {
      provide: IUserRepository,
      useClass: UserRepository
    },
    UserFacade,
    {
      provide: IUserFacade,
      useClass: UserFacade
    }
  ],
  exports: [
    IUserFacade,
    IUserRepository
  ]
})
export class UserIntegrationModule {}
