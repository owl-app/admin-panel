import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type'
import { EntitySchema } from 'typeorm'

export function getQueryServiceToken(DTOClass: EntityClassOrSchema): string {
  if(DTOClass instanceof EntitySchema) {
    return `${DTOClass.options.name}QueryService`
  }

  return `${DTOClass.name}QueryService`
}
