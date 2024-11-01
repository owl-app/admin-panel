import { DataSource, DataSourceOptions, ObjectLiteral } from 'typeorm';
import { DynamicModule, Module } from '@nestjs/common';

import { Role, Archivable, TenantAware } from '@owl-app/lib-contracts';
import { RegistryServiceModule } from '@owl-app/registry-nestjs';

import { DEFAULT_DATA_SOURCE_NAME } from '../contants';
import { CrudTypeOrmQueryService, CrudTypeOrmQueryServiceOpts } from '../crud/service/crud-typeorm-query.service';
import { FilterQuery } from '../registry/interfaces/filter-query';
import { EntitySetter } from '../registry/interfaces/entity-setter';
import {
  FILTER_REGISTRY_TENANT,
  SETTER_REGISTRY_TENANT,
} from '../registry/constants';

import { TenantRelationFilter } from './filters/tenant-relation.filter';
import { TenantRelationSetter } from './setters/tenant-relation.setter';
import {
  CrudTypeOrmQueryEntitiesOpts,
  CrudTypeOrmQueryModule,
} from '../crud/crud-typeorm-query.module';
import { RolesFilter } from './filters/roles.filter';

export interface CrudTenantTypeOrmQueryModuleOpts {
  entities: CrudTypeOrmQueryEntitiesOpts[];
  queryServiceOpts?: CrudTypeOrmQueryServiceOpts<unknown>
}

@Module({})
export class CrudTenantTypeOrmQueryModule {
  static forFeature(
    opts: CrudTenantTypeOrmQueryModuleOpts,
    dataSource:
      | DataSource
      | DataSourceOptions
      | string = DEFAULT_DATA_SOURCE_NAME
  ): DynamicModule {
    return CrudTypeOrmQueryModule.forFeature(
      {
        ...opts,
        queryService: {
          classService: CrudTypeOrmQueryService,
          inject: [FILTER_REGISTRY_TENANT, SETTER_REGISTRY_TENANT],
          opts: opts.queryServiceOpts
        },
        importsQueryTypeOrm: [
          RegistryServiceModule.forFeature<FilterQuery<ObjectLiteral>>({
            name: FILTER_REGISTRY_TENANT,
            services: {
              tenant: TenantRelationFilter<TenantAware>,
              roles: RolesFilter<Role>,
            },
          }),
          RegistryServiceModule.forFeature<EntitySetter<ObjectLiteral>>({
            name: SETTER_REGISTRY_TENANT,
            services: {
              tenant: TenantRelationSetter<TenantAware>,
            },
          }),
        ],
      },
      dataSource
    );
  }
}
