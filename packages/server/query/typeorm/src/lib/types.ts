import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import {
  DynamicModule,
  ForwardReference,
  InjectionToken,
  OptionalFactoryDependency,
} from '@nestjs/common';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

import { Class, QueryService } from '@owl-app/nestjs-query-core';
import { TypeOrmQueryServiceOpts } from './services';

export interface NestjsQueryTypeOrmModuleOpts {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entities: NestjsQueryTypeOrmModuleEntitiesOpts[];
  imports?: Array<
    Class<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
  typeOrmModule?: DynamicModule;
  connection?: DataSource | string;
  queryService?: NestjsQueryTypeOrmModuleQueryServiceOpts;
}

export interface NestjsQueryTypeOrmModuleQueryServiceOpts {
  classService: Class<QueryService<any>>;
  inject?: Array<InjectionToken | OptionalFactoryDependency>;
  opts?: TypeOrmQueryServiceOpts<any>;
}

export interface NestjsQueryTypeOrmModuleEntitiesOpts {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entity: EntityClassOrSchema;
  repository?: NestjsQueryTypeOrmModuleEntitiesRepositoryOpts;
}

export interface NestjsQueryTypeOrmModuleEntitiesRepositoryOpts {
  obj: Class<Repository<ObjectLiteral>> | Function | string;
  injectInProviders?: boolean;
}
