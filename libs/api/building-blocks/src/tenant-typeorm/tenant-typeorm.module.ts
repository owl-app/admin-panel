import { DataSource, DataSourceOptions } from 'typeorm';
import { DynamicModule, Module } from '@nestjs/common';

import { DEFAULT_DATA_SOURCE_NAME } from './constants';
import { createTypeOrmProviders } from './tenant-typeorm.providers';
import { TenantTypeOrmOpts } from './types';
import { RegistryServiceModule } from '@owl-app/registry-nestjs';
import { TenantFilter } from './filters/tenant-filter';
import { CompanyFilter } from './filters/company-filter';

const FILTER_REGISTRY_TENANT = 'FILTER_REGISTRY_TENANT';

@Module({})
export class TenantTypeOrmModule {
  static forFeature(
    opts: TenantTypeOrmOpts,
    dataSource:
      | DataSource
      | DataSourceOptions
      | string = DEFAULT_DATA_SOURCE_NAME,
  ): DynamicModule {
    const providers = createTypeOrmProviders(opts.entities, dataSource);

    return {
      imports:[
        RegistryServiceModule.forFeature<TenantFilter>({
          name: FILTER_REGISTRY_TENANT,
          services: {
            company: CompanyFilter
          }
        })
      ],
      module: TenantTypeOrmModule,
      providers: providers,
      exports: providers,
    };
  }
}
