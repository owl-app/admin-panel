import { DataSource, DataSourceOptions, ObjectLiteral } from 'typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DynamicModule, Module } from '@nestjs/common';

import { CompanyAware, TenantAware } from '@owl-app/lib-contracts';
import { RegistryServiceModule } from '@owl-app/registry-nestjs';
import { Assembler, Class, Filter, NestjsQueryCoreModule } from '@owl-app/crud-core';
import { NestjsQueryTypeOrmModule } from '@owl-app/crud-nestjs'

import { TypeOrmEntitesOpts } from '../typeorm/types';
import { DEFAULT_DATA_SOURCE_NAME } from '../typeorm/constants';
import { getRepositoryToken } from '../typeorm/common/tenant-typeorm.utils';

import { FILTER_REGISTRY_TENANT, SETTER_REGISTRY_TENANT } from './constants';
import { CompanySetter } from './setters/company.setter';
import { TenantTypeOrmQueryService } from './services/tenant-typeorm-query.service';
import { FilterBuilder } from '../data-provider/filter.builder';
import { createPaginatedQueryServiceProvider } from '../data-provider/query/providers';
import { PaginationConfigProvider } from '../config/pagination';
import { TenantRelationFilter } from './filters/tenant-relation.filter';
import { TenantFilter } from './filters/tenant.filter';
import { TypeOrmModule } from '../typeorm/typeorm.module';
import { TenantRelationSetter } from './setters/tenant-relation.setter';
import { TenantSetter } from './setters/tenant.setter';

export interface NestjsQueryCoreModuleOpts {
  entities: NestjsQueryCoreEntitiesOpts[]
}

export interface NestjsQueryCoreEntitiesOpts extends TypeOrmEntitesOpts {
  dataProvider?: NestjsQueryCoreDataProviderOpts
  assembler?: Class<Assembler<any, any, any, any, any, any>>
}

export interface NestjsQueryCoreDataProviderOpts {
  filterBuilder?: Class<FilterBuilder<Filter<EntityClassOrSchema>, any>>
  
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

    const assemblers = opts.entities.reduce((assemblers, opt) => {
      if(opt.assembler) {
        assemblers.push(opt.assembler);
      }

      return assemblers;
    }, []);

    const entities = opts.entities.map((opt) => {
      return {
        entity: opt.entity,
        repository: {
          obj: getRepositoryToken(opt.entity),
          injectInProviders: true
        }
      }
    });

    const dataProviders = opts.entities.reduce((dataProviders, opt) => {
      if(opt.dataProvider) {
        dataProviders.push(createPaginatedQueryServiceProvider(
          opt.entity,
          opt.dataProvider.filterBuilder,
          opt.assembler
        ));
      }

      return dataProviders;
    }, []);

    return {
      imports:[
        NestjsQueryCoreModule.forFeature({
          imports: [
            NestjsQueryTypeOrmModule.forFeature({
              imports: [
                RegistryServiceModule.forFeature<TenantFilter<ObjectLiteral>>({
                  name: FILTER_REGISTRY_TENANT,
                  services: {
                    tenant: TenantRelationFilter<TenantAware>
                  }
                }),
                RegistryServiceModule.forFeature<TenantSetter<ObjectLiteral>>({
                  name: SETTER_REGISTRY_TENANT,
                  services: {
                    company: CompanySetter<CompanyAware>,
                    tenant: TenantRelationSetter<TenantAware>
                  }
                })
              ],
              queryService: {
                classService: TenantTypeOrmQueryService,
                inject: [FILTER_REGISTRY_TENANT, SETTER_REGISTRY_TENANT]
              },
              typeOrmModule: TypeOrmModule.forFeature({ entities: opts.entities }, dataSource),
              entities
            }),
          ],
          assemblers: [...assemblers ?? []],
        }),
      ],
      module: CrudTenantTypeOrmModule,
      providers: [PaginationConfigProvider, ...dataProviders ?? []],
      exports: [NestjsQueryCoreModule, ...dataProviders ?? []],
    };
  }
}
