import { DataSource, DataSourceOptions } from 'typeorm';
import { DynamicModule, Module } from '@nestjs/common';

import { RegistryServiceModule } from '@owl-app/registry-nestjs';
import { Assembler, Class, NestjsQueryCoreModule } from '@owl-app/crud-core';
import { NestjsQueryTypeOrmModule } from '@owl-app/crud-nestjs'

import { TypeOrmOpts } from '../typeorm/types';
import { DEFAULT_DATA_SOURCE_NAME } from '../typeorm/constants';
import { TypeOrmModule } from '../typeorm/typeorm.module';
import { getTenantRepositoryToken } from '../typeorm/common/tenant-typeorm.utils';

import { FILTER_REGISTRY_TENANT } from './constants';
import { TenantFilter } from './filters/tenant-filter';
import { CompanyFilter } from './filters/company-filter';
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

    const entitiesCrud = opts.entities.map((opt) => {
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
        TypeOrmModule.forFeature(newOptions, dataSource),
        NestjsQueryCoreModule.forFeature({
          imports: [
            NestjsQueryTypeOrmModule.forFeature({
              imports: [
                TenantTypeOrmModule.forFeature(newOptions)
              ],
              entities: entitiesCrud
            }),
          ],
          assemblers: [...opts.assemblers ?? []],
        }),
      ],
      module: CrudTenantTypeOrmModule,
      exports: [TypeOrmModule, NestjsQueryCoreModule],
    };
  }
}
