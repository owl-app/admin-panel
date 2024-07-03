import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type"
import { Class } from "@owl-app/crud-core"
import { ObjectLiteral, Repository } from "typeorm"

export interface NestjsQueryTypeOrmModuleEntitiesRepositoryOpts {
  obj: Class<Repository<ObjectLiteral>>,
  injectInProviders?: boolean
}

export interface NestjsQueryTypeOrmModuleEntitiesOpts {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entity: EntityClassOrSchema,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  repository?: NestjsQueryTypeOrmModuleEntitiesRepositoryOpts
}