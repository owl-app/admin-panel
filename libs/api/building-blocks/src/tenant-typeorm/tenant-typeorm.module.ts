import { DataSource, DataSourceOptions, ObjectLiteral } from 'typeorm';
import { DynamicModule, Module } from '@nestjs/common';

import { CompanyAware, TenantAware } from '@owl-app/lib-contracts';
import { RegistryServiceModule } from '@owl-app/registry-nestjs';

import { TypeOrmOpts } from '../typeorm/types';
import { DEFAULT_DATA_SOURCE_NAME } from '../typeorm/constants';
import { TypeOrmModule } from '../typeorm/typeorm.module';

import { FILTER_REGISTRY_TENANT, SETTER_REGISTRY_TENANT } from '../registry/constants';
import { CompanySetter } from './setters/company.setter';
import { TenantRelationFilter } from './filters/tenant-relation.filter';
import { FilterQuery } from '../registry/interfaces/filter-query';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TenantRelationSetter } from './setters/tenant-relation.setter';
import { EntitySetter } from '../registry/interfaces/entity-setter';

@Module({})
export class TenantTypeOrmModule {
  static forFeature(
    opts: TypeOrmOpts,
    dataSource:
      | DataSource
      | DataSourceOptions
      | string = DEFAULT_DATA_SOURCE_NAME,
  ): DynamicModule {

    const optsWithRegistries = opts.entities.map((entity) => {
      return {
        ...entity,
        inject: [FILTER_REGISTRY_TENANT, SETTER_REGISTRY_TENANT, EventEmitter2]
      }
    });

    const newOptions = Object.assign({
      opts, 
      entities: optsWithRegistries, 
      imports: [
        RegistryServiceModule.forFeature<FilterQuery<ObjectLiteral>>({
          name: FILTER_REGISTRY_TENANT,
          services: {
            // company: CompanyRelationFilter<CompanyAware>,
            tenant: TenantRelationFilter<TenantAware>
          }
        }),
        RegistryServiceModule.forFeature<EntitySetter<ObjectLiteral>>({
          name: SETTER_REGISTRY_TENANT,
          services: {
            company: CompanySetter<CompanyAware>,
            tenant: TenantRelationSetter<TenantAware>
          }
        }),
        EventEmitter2
      ]
    });

    return {
      imports:[
        TypeOrmModule.forFeature(newOptions, dataSource),
      ],
      module: TenantTypeOrmModule,
      exports: [TypeOrmModule],
    };
  }
}
