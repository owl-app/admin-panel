
import { Module } from '@nestjs/common'

import { NestjsQueryCoreModule } from '@owl-app/crud-core'
import { NestjsQueryTypeOrmModule } from '@owl-app/crud-nestjs'

import { RbacTypeOrmModule } from '@owl-app/lib-api-bulding-blocks/rbac/rbac-typeorm.module'
import { getTenantRepositoryToken } from '@owl-app/lib-api-bulding-blocks/tenant-typeorm/common/tenant-typeorm.utils'
import { TenantTypeOrmModule } from '@owl-app/lib-api-bulding-blocks/tenant-typeorm/tenant-typeorm.module'

import { UserEntity } from '../database/entity/user.entity'
import { UserRepository } from '../database/repository/user.repository'

import { UserCrudController } from './features/v1/crud/crud.http.controller'
import { AssignAccessController } from './features/v1/assing-access/assign-access.http.controller'
import { UserAssembler } from './features/v1/crud/user.assembler'
import { UserService } from './features/v1/crud/user.service'

import { User } from '../domain/model/user'

@Module({
  imports: [
    RbacTypeOrmModule.forFeature({}),
    NestjsQueryCoreModule.forFeature({
      imports: [
        NestjsQueryTypeOrmModule.forFeature({
          imports: [
            TenantTypeOrmModule.forFeature({
              entities: [
                {
                  entity: UserEntity,
                  repository: UserRepository
                }
              ]
            }),
          ],
          entities: [
            {
              entity: UserEntity,
              repository: {
                obj: getTenantRepositoryToken(User),
                injectInProviders: true
              }
            }
          ]
        }),
      ],
      assemblers: [UserAssembler]
    })
  ],
  controllers: [
    UserCrudController,
    AssignAccessController
  ],
  providers: [
    UserService
  ]
})
export class UserModule {}