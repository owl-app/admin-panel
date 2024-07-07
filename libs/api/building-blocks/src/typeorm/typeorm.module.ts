import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmModule as BaseTypeOrmModule } from '@nestjs/typeorm';
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
    const entities = opts.entities.map(entity => entity.entity);

    const baseTypeOrmModule = BaseTypeOrmModule.forFeature(entities, dataSource);

    return {
      imports:[baseTypeOrmModule, ...opts.imports ?? []],
      module: TypeOrmModule,
      providers: providers,
      exports: [baseTypeOrmModule, ...providers],
    };
  }
}
