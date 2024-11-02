import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { DynamicModule, ForwardReference, InjectionToken, OptionalFactoryDependency } from '@nestjs/common';

import {
  Assembler,
  Class,
  Filter,
  QueryService,
} from '@owl-app/nestjs-query-core';

import { AppTypeOrmEntitesOpts } from '../typeorm/types';
import { FilterBuilder } from '../data-provider/filter.builder';

import { AppTypeOrmQueryServiceOpts } from './typeorm/services/app-typeorm-query.service';

export interface AppNestjsQueryTypeOrmModuleOpts {
  entities: AppNestjsQueryTypeOrmEntitiesOpts[];
  queryService?: {
    classService?: Class<QueryService<any>>;
    inject?: Array<InjectionToken | OptionalFactoryDependency>;
    opts?: AppTypeOrmQueryServiceOpts<unknown>
  };
  importsQueryTypeOrm?: Array<
    Class<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
}

export interface AppNestjsQueryTypeOrmEntitiesOpts extends AppTypeOrmEntitesOpts {
  dataProvider?: AppNestjsQueryTypeOrmProviderOpts;
  assembler?: Class<Assembler<any, any, any, any, any, any>>;
}

export interface AppNestjsQueryTypeOrmProviderOpts {
  filterBuilder?: Class<FilterBuilder<Filter<EntityClassOrSchema>, any>>;
}