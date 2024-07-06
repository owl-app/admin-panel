import { ObjectLiteral, Repository } from "typeorm"
import { DynamicModule, ForwardReference } from "@nestjs/common"
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type"

import { Class } from "@owl-app/crud-core"

export interface TenantTypeOrmEntitesOpts {
  entity: EntityClassOrSchema,
  repository: Class<Repository<ObjectLiteral>>,
}

export interface TenantTypeOrmOpts {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imports?: Array<Class<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>
  entities: TenantTypeOrmEntitesOpts[],
}