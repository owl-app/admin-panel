import { DataSource, DataSourceOptions, ObjectLiteral } from 'typeorm';
import { DynamicModule, Module } from '@nestjs/common';

import { CompanyAware, TenantAware } from '@owl-app/lib-contracts';
import { RegistryServiceModule } from '@owl-app/registry-nestjs';

import { TypeOrmOpts } from '../typeorm/types';
import { DEFAULT_DATA_SOURCE_NAME } from '../typeorm/constants';
import { TypeOrmModule } from '../typeorm/typeorm.module';

import { FILTER_REGISTRY_TENANT, SETTER_REGISTRY_TENANT } from './constants';
import { CompanyRelationFilter } from './filters/company-relation.filter';
import { CompanySetter } from './setters/company.setter';
import { TenantRelationFilter } from './filters/tenant-relation.filter';
import { TenantFilter } from './filters/tenant.filter';

@Module({})
export class TenantTypeOrmModule {
  static forFeature(
    opts: TypeOrmOpts,
    dataSource:
      | DataSource
      | DataSourceOptions
      | string = DEFAULT_DATA_SOURCE_NAME,
  ): DynamicModule {

    const optsWithFilterRegistry = opts.entities.map((entity) => {
      return {
        ...entity,
        inject: [FILTER_REGISTRY_TENANT, SETTER_REGISTRY_TENANT]
      }
    });

    const newOptions = Object.assign({
      opts, 
      entities: optsWithFilterRegistry, 
      imports: [
        RegistryServiceModule.forFeature<TenantFilter<ObjectLiteral>>({
          name: FILTER_REGISTRY_TENANT,
          services: {
            // company: CompanyRelationFilter<CompanyAware>,
            tenant: TenantRelationFilter<TenantAware>
          }
        }),
        RegistryServiceModule.forFeature({
          name: SETTER_REGISTRY_TENANT,
          services: {
            company: CompanySetter<CompanyAware>
          }
        })
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
