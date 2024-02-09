import { FactoryProvider } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import type { DataSource, Repository } from 'typeorm'
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type'

import { TypeOrmQueryService } from './services'
import { getQueryServiceToken } from './decorators'

function createTypeOrmQueryServiceProvider<Entity>(
  EntityClass: EntityClassOrSchema,
  connection?: DataSource | string
): FactoryProvider {
  return {
    provide: getQueryServiceToken(EntityClass),
    useFactory(repo: Repository<Entity>) {
      return new TypeOrmQueryService(repo)
    },
    inject: [getRepositoryToken(EntityClass, connection)]
  }
}

export const createTypeOrmQueryServiceProviders = (
  entities: EntityClassOrSchema[],
  connection?: DataSource | string
): FactoryProvider[] => entities.map((entity) => createTypeOrmQueryServiceProvider(entity, connection))
