import { DataSource, DataSourceOptions } from 'typeorm';
import { DynamicModule, Module } from '@nestjs/common';

import { CompanyAware } from '@owl-app/lib-contracts';
import { RegistryServiceModule } from '@owl-app/registry-nestjs';

import { TypeOrmOpts } from '../typeorm/types';
import { DEFAULT_DATA_SOURCE_NAME } from '../typeorm/constants';
import { TypeOrmModule } from '../typeorm/typeorm.module';

import { FILTER_REGISTRY_TENANT, SETTER_REGISTRY_TENANT } from './constants';
import { CompanyFilter } from './filters/company.filter';
import { CompanySetter } from './setters/company.setter';

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
        inject: [FILTER_REGISTRY_TENANT]
      }
    });

    const newOptions = Object.assign({
      opts, 
      entities: optsWithFilterRegistry, 
      imports: [
        RegistryServiceModule.forFeature({
          name: FILTER_REGISTRY_TENANT,
          services: {
            company: CompanyFilter<CompanyAware>
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
