import { DataSource, ObjectLiteral, Repository } from "typeorm"
import { DynamicModule, ForwardReference } from "@nestjs/common"
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type"

import { Class } from "@owl-app/crud-core"

export interface NestjsQueryCoreModuleOpts {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entities: NestjsQueryTypeOrmModuleEntitiesOpts[],
  imports?: Array<Class<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>
  typeOrmModule?: DynamicModule,
  connection?: DataSource | string
}

export interface NestjsQueryTypeOrmModuleEntitiesOpts {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entity: EntityClassOrSchema,
  repository?: NestjsQueryTypeOrmModuleEntitiesRepositoryOpts
}

export interface NestjsQueryTypeOrmModuleEntitiesRepositoryOpts {
  obj: Class<Repository<ObjectLiteral>> | Function | string,
  injectInProviders?: boolean
}