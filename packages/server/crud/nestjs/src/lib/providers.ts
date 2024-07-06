import { FactoryProvider } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import type { DataSource, Repository } from 'typeorm'
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type'

import { isObject } from '@owl-app/utils'

import { TypeOrmQueryService } from './services'
import { getQueryServiceToken } from './decorators'
import type { NestjsQueryTypeOrmModuleEntitiesRepositoryOpts } from './types'

export function createTypeOrmQueryServiceProvider<Entity>(
  entity: EntityClassOrSchema,
  repository?: NestjsQueryTypeOrmModuleEntitiesRepositoryOpts,
  connection?: DataSource | string,
): FactoryProvider {
  const { obj: RepositoryObj , injectInProviders = false} = repository ?? {};

  return {
    provide: getQueryServiceToken(entity),
    useFactory(baseRepo: Repository<Entity>) {
      if (isObject(RepositoryObj) && !injectInProviders) {
        const RepositoryClass = RepositoryObj as new (repo: Repository<Entity>) => any;

        return new TypeOrmQueryService(new RepositoryClass(baseRepo));
      }

      return new TypeOrmQueryService(baseRepo);
    },
    inject: [
      injectInProviders ? RepositoryObj : getRepositoryToken(entity, connection),
    ]
  }
}

