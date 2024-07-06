import { DataSource, DataSourceOptions } from 'typeorm';
import { DynamicModule, Module } from '@nestjs/common';

import { TypeOrmOpts } from './types';
import { DEFAULT_DATA_SOURCE_NAME } from './constants';
import { createTypeOrmProviders } from './tenant-typeorm.providers';

@Module({})
export class TypeOrmModule {
  static forFeature(
    opts: TypeOrmOpts,
    dataSource:
      | DataSource
      | DataSourceOptions
      | string = DEFAULT_DATA_SOURCE_NAME,
  ): DynamicModule {
    const providers = createTypeOrmProviders(opts.entities, dataSource);

    return {
      imports:[...opts.imports ?? []],
      module: TypeOrmModule,
      providers: providers,
      exports: providers,
    };
  }
}
