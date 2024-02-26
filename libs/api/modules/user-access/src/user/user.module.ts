
import { Module } from '@nestjs/common'

import { NestjsQueryCoreModule } from '@owl-app/crud-core'
import { NestjsQueryTypeOrmModule } from '@owl-app/crud-nestjs'
import { RbacTypeOrmModule } from '@owl-app/lib-api-bulding-blocks/rbac/rbac-typeorm.module'

import { UserEntity } from '../database/entity/user.entity'

import { UserCrudController } from './features/v1/crud/crud.http.controller'
import { UserAssembler } from './features/v1/crud/user.assembler'
import { UserService } from './features/v1/crud/user.service'

@Module({
  imports: [
    RbacTypeOrmModule.forFeature({}),
    NestjsQueryCoreModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([UserEntity])],
      assemblers: [UserAssembler]
    })
  ],
  controllers: [
    UserCrudController
  ],
  providers: [
    UserService
  ]
})
export class UserModule {}