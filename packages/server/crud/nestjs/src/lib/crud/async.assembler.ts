import { Assembler as BaseAssembler, DeepPartial } from '@owl-app/crud-core'

export interface AsyncAssembler<DTO, Entity, C = DeepPartial<DTO>, CE = DeepPartial<Entity>, U = C, UE = CE> extends BaseAssembler<DTO, Entity, C, CE, U, UE> {
  convertAsyncToCreateEntity(create: C): Promise<CE>;

  convertAsyncToCreateEntities(createDtos: C[]): Promise<CE[]>
}