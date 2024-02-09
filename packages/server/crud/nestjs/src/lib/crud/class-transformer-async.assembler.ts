import { ClassTransformerAssembler as BaseClassTransformerAssembler, DeepPartial } from '@owl-app/crud-core';
import { AsyncAssembler } from './async.assembler';

export abstract class ClassTransformerAsyncAssembler<
  DTO,
  Entity extends DeepPartial<Entity>,
  C = DeepPartial<DTO>,
  CE = DeepPartial<Entity>,
  U = C,
  UE = CE
> extends BaseClassTransformerAssembler<DTO, Entity> implements AsyncAssembler<DTO, Entity> {

  abstract convertAsyncToCreateEntity(create: DeepPartial<DTO>): Promise<DeepPartial<Entity>>;

  async convertAsyncToCreateEntities(createDtos: DeepPartial<DTO>[]): Promise<DeepPartial<Entity>[]> {
    return await Promise.all(createDtos.map(async (c): Promise<Promise<DeepPartial<Entity>>> => {
      return await this.convertAsyncToCreateEntity(c);
    }));
  }

}
