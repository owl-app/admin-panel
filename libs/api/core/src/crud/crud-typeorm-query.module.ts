import { DataSource, DataSourceOptions } from 'typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DynamicModule, ForwardReference, Module } from '@nestjs/common';

import {
  Assembler,
  Class,
  Filter,
  NestjsQueryCoreModule,
} from '@owl-app/crud-core';
import {
  NestjsQueryTypeOrmModule,
  NestjsQueryTypeOrmModuleQueryServiceOpts,
} from '@owl-app/crud-nestjs';

import { TypeOrmEntitesOpts } from '../typeorm/types';
import { DEFAULT_DATA_SOURCE_NAME } from '../contants';
import { CrudTypeOrmQueryService } from '../crud/service/crud-typeorm-query.service';
import { FilterBuilder } from '../data-provider/filter.builder';
import { createPaginatedQueryServiceProvider } from '../data-provider/query/providers';
import { PaginationConfigProvider } from '../config/pagination';
import { TypeOrmModule } from '../typeorm/typeorm.module';
import { FiltersRegistry, FitersCustomRegistry } from '../data-provider/query/filters.registry';
import { getQueryServiceRepositoryToken } from './common/repository.utils';

export interface CrudTypeOrmQueryModuleOpts {
  entities: CrudTypeOrmQueryEntitiesOpts[];
  queryService?: NestjsQueryTypeOrmModuleQueryServiceOpts;
  importsQueryTypeOrm?: Array<
    Class<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
}

export interface CrudTypeOrmQueryEntitiesOpts extends TypeOrmEntitesOpts {
  dataProvider?: CrudTypeOrmQueryProviderOpts;
  assembler?: Class<Assembler<any, any, any, any, any, any>>;
}

export interface CrudTypeOrmQueryProviderOpts {
  filterBuilder?: Class<FilterBuilder<Filter<EntityClassOrSchema>, any>>;
}

@Module({})
export class CrudTypeOrmQueryModule {
  static forFeature(
    opts: CrudTypeOrmQueryModuleOpts,
    dataSource:
      | DataSource
      | DataSourceOptions
      | string = DEFAULT_DATA_SOURCE_NAME
  ): DynamicModule {
    const queryService = opts.queryService ?? {
      classService: CrudTypeOrmQueryService,
    };

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
              imports: [...(opts.importsQueryTypeOrm ?? [])],
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
      module: CrudTypeOrmQueryModule,
      providers: [PaginationConfigProvider, ...(dataProviders ?? [])],
      exports: [NestjsQueryCoreModule, ...(dataProviders ?? [])],
    };
  }
}
