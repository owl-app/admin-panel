import { DataSource, DataSourceOptions } from 'typeorm';
import { DynamicModule, Module } from '@nestjs/common';

import { RegistryServiceModule } from '@owl-app/registry-nestjs';

import { TypeOrmOpts } from '../typeorm/types';
import { DEFAULT_DATA_SOURCE_NAME } from '../typeorm/constants';
import { TypeOrmModule } from '../typeorm/typeorm.module';

import { FILTER_REGISTRY_TENANT } from './constants';
import { TenantFilter } from './filters/tenant-filter';
import { CompanyFilter } from './filters/company-filter';

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
        RegistryServiceModule.forFeature<TenantFilter>({
          name: FILTER_REGISTRY_TENANT,
          services: {
            company: CompanyFilter
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