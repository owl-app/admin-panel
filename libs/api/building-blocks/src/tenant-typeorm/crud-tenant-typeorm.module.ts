import { DataSource, DataSourceOptions } from 'typeorm';
import { DynamicModule, Module } from '@nestjs/common';

import { Assembler, Class, NestjsQueryCoreModule } from '@owl-app/crud-core';
import { NestjsQueryTypeOrmModule } from '@owl-app/crud-nestjs'

import { TypeOrmOpts } from '../typeorm/types';
import { DEFAULT_DATA_SOURCE_NAME } from '../typeorm/constants';
import { getTenantRepositoryToken } from '../typeorm/common/tenant-typeorm.utils';

import { TenantTypeOrmModule } from './tenant-typeorm.module';

export interface NestjsQueryCoreModuleOpts extends TypeOrmOpts {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assemblers?: Class<Assembler<any, any, any, any, any, any>>[]
}

@Module({})
export class CrudTenantTypeOrmModule {
  static forFeature(
    opts: NestjsQueryCoreModuleOpts,
    dataSource:
      | DataSource
      | DataSourceOptions
      | string = DEFAULT_DATA_SOURCE_NAME,
  ): DynamicModule {

    const entities = opts.entities.map((opt) => {
      return {
        entity: opt.entity,
        repository: {
          obj: getTenantRepositoryToken(opt.entity),
          injectInProviders: true
        }
      }
    });

    return {
      imports:[
        NestjsQueryCoreModule.forFeature({
          imports: [
            NestjsQueryTypeOrmModule.forFeature({
              typeOrmModule: TenantTypeOrmModule.forFeature(opts, dataSource),
              entities
            }),
          ],
          assemblers: [...opts.assemblers ?? []],
        }),
      ],
      module: CrudTenantTypeOrmModule,
      exports: [NestjsQueryCoreModule],
    };
  }
}
