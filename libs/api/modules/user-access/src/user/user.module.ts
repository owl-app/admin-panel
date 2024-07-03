
import { Module } from '@nestjs/common'

import { NestjsQueryCoreModule } from '@owl-app/crud-core'
import { NestjsQueryTypeOrmModule } from '@owl-app/crud-nestjs'
import { RbacTypeOrmModule } from '@owl-app/lib-api-bulding-blocks/rbac/rbac-typeorm.module'

import { UserEntity } from '../database/entity/user.entity'
import { IUserRepository } from '../database/repository/user-repository.interface'
import { UserRepository } from '../database/repository/user.repository'

import { UserCrudController } from './features/v1/crud/crud.http.controller'
import { AssignAccessController } from './features/v1/assing-access/assign-access.http.controller'
import { UserAssembler } from './features/v1/crud/user.assembler'
import { UserService } from './features/v1/crud/user.service'

@Module({
  imports: [
    RbacTypeOrmModule.forFeature({}),
    NestjsQueryCoreModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([
        {
          entity: UserEntity,
          repository: {
            obj: UserRepository,
          }
        }
      ])],
      assemblers: [UserAssembler]
    })
  ],
  controllers: [
    UserCrudController,
    AssignAccessController
  ],
  providers: [
    UserService,
    {
      provide: IUserRepository,
      useClass: UserRepository
    }
  ]
})
export class UserModule {}