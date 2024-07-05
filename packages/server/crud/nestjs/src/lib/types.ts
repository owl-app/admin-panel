import { DataSource, ObjectLiteral, Repository } from "typeorm"
import { DynamicModule, ForwardReference } from "@nestjs/common"
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type"

import { Class } from "@owl-app/crud-core"

export interface NestjsQueryCoreModuleOpts {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imports?: Array<Class<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>
  entities: NestjsQueryTypeOrmModuleEntitiesOpts[],
  connection?: DataSource | string
}

export interface NestjsQueryTypeOrmModuleEntitiesRepositoryOpts {
  obj: Class<Repository<ObjectLiteral>>,
  injectInProviders?: boolean
}

export interface NestjsQueryTypeOrmModuleEntitiesOpts {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imports?: Array<Class<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>
  entity: EntityClassOrSchema,
  repository?: NestjsQueryTypeOrmModuleEntitiesRepositoryOpts
}