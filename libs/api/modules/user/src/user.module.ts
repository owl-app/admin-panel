import { Module } from '@nestjs/common';

import { AppRequestContextService } from '@owl-app/lib-api-bulding-blocks/infrastructure/context';
import { NestjsQueryCoreModule } from '@owl-app/crud-core';
import { NestjsQueryTypeOrmModule } from '@owl-app/crud-nestjs';

import { IUserFacade } from './integration/user.facade';
import { IUserRepository } from './domain/repository/user-repository.interface';

import { UserEntity, UserService, UserAssembler } from './infrastructure';
import { UserRepository } from './infrastructure/persistence/repository/user.repository';
import { getMeProvider } from './infrastructure/use-cases-providers/get-me.provider';


import { UserCrudController } from './presentation';
import { GetMeController } from './presentation/api/get-me/get-me.controller';

import { UserFacade } from './integration/user.facade';

@Module({
  imports: [
    NestjsQueryCoreModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([UserEntity])],
      assemblers: [UserAssembler]
    })
  ],
  controllers: [
    UserCrudController,
    GetMeController
  ],
  providers: [
    getMeProvider,
    UserService,
    UserRepository,
    AppRequestContextService,
    {
      provide: IUserRepository,
      useClass: UserRepository
    },
    {
      provide: IUserFacade,
      useClass: UserFacade
    }
  ],
  exports: [
    UserService,
    UserRepository,
    IUserRepository
  ]
})
export class UserModule {}
