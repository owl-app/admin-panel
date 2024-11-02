import { DataSource, DataSourceOptions, ObjectLiteral } from 'typeorm';
import { DynamicModule, Module } from '@nestjs/common';

import { Archivable, Role, TenantAware } from '@owl-app/lib-contracts';
import { RegistryServiceModule } from '@owl-app/registry-nestjs';

import { AppTypeOrmOpts } from './types';
import { DEFAULT_DATA_SOURCE_NAME } from '../contants';
import { TypeOrmModule } from './typeorm.module';

import {
  FILTER_REGISTRY_TENANT,
  SETTER_REGISTRY_TENANT,
} from '../registry/constants';
import { TenantRelationFilter } from './filters/tenant-relation.filter';
import { FilterQuery } from '../registry/interfaces/filter-query';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TenantRelationSetter } from './setters/tenant-relation.setter';
import { EntitySetter } from '../registry/interfaces/entity-setter';
import { RolesFilter } from './filters/roles.filter';
import { NonArchivedFilter } from './filters/non-archived.filter';

@Module({})
export class AppTypeOrmModule {
  static forFeature(
    opts: AppTypeOrmOpts,
    dataSource:
      | DataSource
      | DataSourceOptions
      | string = DEFAULT_DATA_SOURCE_NAME
  ): DynamicModule {
    const optsWithRegistries = opts.entities.map((entity) => {
      return {
        ...entity,
        inject: [FILTER_REGISTRY_TENANT, SETTER_REGISTRY_TENANT, EventEmitter2],
      };
    });

    const newOptions = Object.assign({
      opts,
      entities: optsWithRegistries,
      imports: [
        RegistryServiceModule.forFeature<FilterQuery<ObjectLiteral>>({
          name: FILTER_REGISTRY_TENANT,
          services: {
            tenant: TenantRelationFilter<TenantAware>,
            roles: RolesFilter<Role>,
            archived: NonArchivedFilter<Archivable>,
          },
        }),
        RegistryServiceModule.forFeature<EntitySetter<ObjectLiteral>>({
          name: SETTER_REGISTRY_TENANT,
          services: {
            tenant: TenantRelationSetter<TenantAware>,
          },
        }),
        EventEmitter2,
      ],
    });

    return {
      imports: [TypeOrmModule.forFeature(newOptions, dataSource)],
      module: AppTypeOrmModule,
      exports: [TypeOrmModule],
    };
  }
}
