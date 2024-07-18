import { DataSource, DataSourceOptions } from 'typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DynamicModule, Module } from '@nestjs/common';

import { CompanyAware } from '@owl-app/lib-contracts';
import { RegistryServiceModule } from '@owl-app/registry-nestjs';
import { Assembler, Class, Filter, NestjsQueryCoreModule } from '@owl-app/crud-core';
import { NestjsQueryTypeOrmModule } from '@owl-app/crud-nestjs'

import { TypeOrmEntitesOpts } from '../typeorm/types';
import { DEFAULT_DATA_SOURCE_NAME } from '../typeorm/constants';
import { getTenantRepositoryToken } from '../typeorm/common/tenant-typeorm.utils';

import { FILTER_REGISTRY_TENANT, SETTER_REGISTRY_TENANT } from './constants';
import { TenantTypeOrmModule } from './tenant-typeorm.module';
import { CompanyRelationFilter } from './filters/company-relation.filter';
import { CompanySetter } from './setters/company.setter';
import { TenantTypeOrmQueryService } from './services/tenant-typeorm-query.service';
import { CompanyFilter } from './filters/company.filter';
import { FilterBuilder } from '../data-provider/filter.builder';
import { createPaginatedQueryServiceProvider } from '../data-provider/query/providers';
import { PaginationConfigProvider } from '../config/pagination';

export interface NestjsQueryCoreModuleOpts {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assemblers?: Class<Assembler<any, any, any, any, any, any>>[]
  entities: NestjsQueryCoreEntitiesOpts[]
}

export interface NestjsQueryCoreEntitiesOpts extends TypeOrmEntitesOpts {
  dataProviderFilterBuilder?: Class<FilterBuilder<Filter<EntityClassOrSchema>, any>>
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

    const dataProviders = opts.entities.reduce((dataProviders, opt) => {
      if(opt.dataProviderFilterBuilder) {
        dataProviders.push(createPaginatedQueryServiceProvider(opt.entity, opt.dataProviderFilterBuilder));
      }

      return dataProviders;
    }, []);

    return {
      imports:[
        NestjsQueryCoreModule.forFeature({
          imports: [
            NestjsQueryTypeOrmModule.forFeature({
              imports: [
                RegistryServiceModule.forFeature({
                  name: FILTER_REGISTRY_TENANT,
                  services: {
                    companyRelation: CompanyRelationFilter<CompanyAware>,
                    company: CompanyFilter<CompanyAware> 
                  }
                }),
                RegistryServiceModule.forFeature({
                  name: SETTER_REGISTRY_TENANT,
                  services: {
                    company: CompanySetter<CompanyAware>
                  }
                })
              ],
              queryService: {
                classService: TenantTypeOrmQueryService,
                inject: [FILTER_REGISTRY_TENANT, SETTER_REGISTRY_TENANT]
              },
              typeOrmModule: TenantTypeOrmModule.forFeature(opts, dataSource),
              entities
            }),
          ],
          assemblers: [...opts.assemblers ?? []],
        }),
      ],
      module: CrudTenantTypeOrmModule,
      providers: [PaginationConfigProvider, ...dataProviders ?? []],
      exports: [NestjsQueryCoreModule, ...dataProviders ?? []],
    };
  }
}
