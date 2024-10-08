import { ObjectLiteral, Repository } from 'typeorm';
import {
  DynamicModule,
  ForwardReference,
  InjectionToken,
  OptionalFactoryDependency,
} from '@nestjs/common';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

import { Class } from '@owl-app/crud-core';

export interface TypeOrmEntitesOpts {
  entity: EntityClassOrSchema;
  repository?: Class<Repository<ObjectLiteral>>;
  repositoryToken?: string;
  inject?: Array<InjectionToken | OptionalFactoryDependency>;
}

export interface TypeOrmOpts {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imports?: Array<
    Class<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
  entities: TypeOrmEntitesOpts[];
}
