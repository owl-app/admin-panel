import { DataSource, DataSourceOptions, ObjectLiteral } from 'typeorm';
import { DynamicModule, Module } from '@nestjs/common';

import { Role, Archivable, TenantAware } from '@owl-app/lib-contracts';
import { NestjsQueryCoreModule } from '@owl-app/nestjs-query-core';
import { NestjsQueryTypeOrmModule } from '@owl-app/nestjs-query-typeorm';
import { RegistryServiceModule } from '@owl-app/registry-nestjs';

import { createPaginatedQueryServiceProvider } from '../data-provider/query/providers';
import { PaginationConfigProvider } from '../config/pagination';
import { TypeOrmModule } from '../typeorm/typeorm.module';
import { FiltersRegistry, FitersCustomRegistry } from '../data-provider/query/filters.registry';
import { FilterQuery } from '../registry/interfaces/filter-query';
import { EntitySetter } from '../registry/interfaces/entity-setter';
import { RolesFilter } from '../typeorm/filters/roles.filter';
import { NonArchivedFilter } from '../typeorm/filters/non-archived.filter';
import { TenantRelationFilter } from '../typeorm/filters/tenant-relation.filter';
import { TenantRelationSetter } from '../typeorm/setters/tenant-relation.setter';
import { FILTER_REGISTRY_TENANT, SETTER_REGISTRY_TENANT } from '../registry/constants';
import { DEFAULT_DATA_SOURCE_NAME } from '../contants';

import { AppTypeOrmQueryService } from './typeorm/services/app-typeorm-query.service';
import { getQueryServiceRepositoryToken } from './common/repository.utils';
import { AppNestjsQueryTypeOrmModuleOpts } from './types';

@Module({})
export class AppNestjsQueryTypeOrmModule {
  static forFeature(
    opts: AppNestjsQueryTypeOrmModuleOpts,
    dataSource:
      | DataSource
      | DataSourceOptions
      | string = DEFAULT_DATA_SOURCE_NAME
  ): DynamicModule {
    const queryService = {
      classService: opts.queryService?.classService ?? AppTypeOrmQueryService,
      inject: [FILTER_REGISTRY_TENANT, SETTER_REGISTRY_TENANT, ...opts.queryService?.inject ?? []],
      opts: opts.queryService?.opts
    }

    opts.entities.map((opt) => {
      if (!opt.repositoryToken) {
        opt.repositoryToken = getQueryServiceRepositoryToken(
          opt.entity
        ) as string;
      }
    });

    const assemblers = opts.entities.reduce((assemblers, opt) => {
      if (opt.assembler) {
        assemblers.push(opt.assembler);
      }

      return assemblers;
    }, []);

    const entities = opts.entities.map((opt) => {
      return {
        entity: opt.entity,
        repository: {
          obj: getQueryServiceRepositoryToken(opt.entity),
          injectInProviders: true,
        },
      };
    });

    const dataProviders = opts.entities.reduce((dataProviders, opt) => {
      if (opt.dataProvider) {
        dataProviders.push(
          createPaginatedQueryServiceProvider(
            opt.entity,
            opt.dataProvider.filterBuilder,
            opt.assembler
          )
        );
      }

      return dataProviders;
    }, []);

    return {
      imports: [
        NestjsQueryCoreModule.forFeature({
          imports: [
            NestjsQueryTypeOrmModule.forFeature({
              imports: [
                ...[
                  RegistryServiceModule.forFeature<FilterQuery<ObjectLiteral>>({
                    name: FILTER_REGISTRY_TENANT,
                    services: {
                      tenant: TenantRelationFilter<TenantAware>,
                      roles: RolesFilter<Role>,
                      archived: NonArchivedFilter<Archivable>,
                    },
                  }),
                  RegistryServiceModule.forFeature<EntitySetter<ObjectLiteral>>({
                    name: SETTER_REGISTRY_TENANT,
                    services: {
                      tenant: TenantRelationSetter<TenantAware>,
                    },
                  }),
                ],
                ...(opts.importsQueryTypeOrm ?? [])
              ],
              queryService: queryService,
              typeOrmModule: TypeOrmModule.forFeature(
                { entities: opts.entities },
                dataSource
              ),
              entities,
            }),
          ],
          assemblers: [...(assemblers ?? [])],
        }),
        FiltersRegistry,
        FitersCustomRegistry,
      ],
      module: AppNestjsQueryTypeOrmModule,
      providers: [PaginationConfigProvider, ...(dataProviders ?? [])],
      exports: [NestjsQueryCoreModule, ...(dataProviders ?? [])],
    };
  }
}
