import { instanceToPlain, plainToClass } from 'class-transformer';

import { Class, DeepPartial } from '../common';
import { AggregateQuery, AggregateResponse, Query } from '../interfaces';
import { AbstractAssembler } from './abstract.assembler';
import { getAssemblerDeserializer } from './assembler.deserializer';
import { getAssemblerSerializer } from './assembler.serializer';

/**
 * Base assembler that uses class-transformer to transform to and from the DTO/Entity.
 */
export abstract class ClassTransformerAssembler<
  DTO,
  Entity extends DeepPartial<Entity>
> extends AbstractAssembler<
  DTO,
  Entity,
  DeepPartial<DTO>,
  DeepPartial<Entity>,
  DeepPartial<DTO>,
  DeepPartial<Entity>
> {
  convertToDTO(entity: Entity): DTO {
    return this.convert(this.DTOClass, this.toPlain(entity));
  }

  convertToEntity(dto: DTO): Entity {
    return this.convert(this.EntityClass, this.toPlain(dto));
  }

  convertQuery(query: Query<DTO>): Query<Entity> {
    return query as unknown as Query<Entity>;
  }

  convertAggregateQuery(aggregate: AggregateQuery<DTO>): AggregateQuery<Entity> {
    return aggregate as unknown as AggregateQuery<Entity>;
  }

  convertAggregateResponse(aggregate: AggregateResponse<Entity>): AggregateResponse<DTO> {
    return aggregate as unknown as AggregateResponse<DTO>;
  }

  convertToCreateEntity(
    create: DeepPartial<DTO>
  ): DeepPartial<Entity> | Promise<DeepPartial<Entity>> {
    return this.convert(this.EntityClass, create);
  }

  convertToUpdateEntity(
    create: DeepPartial<DTO>
  ): DeepPartial<Entity> | Promise<DeepPartial<Entity>> {
    return this.convert(this.EntityClass, create);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  convert<T>(cls: Class<T>, obj: object): T {
    const deserializer = getAssemblerDeserializer(cls);
    if (deserializer) {
      return deserializer(obj);
    }
    return plainToClass(cls, instanceToPlain(obj));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isConstructor(x: any) {
    const handler = {
      construct() {
        return handler;
      },
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      return !!new new Proxy(x, handler)();
    } catch (e) {
      return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  toPlain(entityOrDto: Entity | DTO): object {
    if (entityOrDto && entityOrDto instanceof this.EntityClass) {
      const serializer = getAssemblerSerializer(this.EntityClass);
      if (serializer) {
        return serializer(entityOrDto);
      }
    } else if (entityOrDto instanceof this.DTOClass) {
      const serializer = getAssemblerSerializer(this.DTOClass);
      if (serializer) {
        return serializer(entityOrDto);
      }
    } else if (entityOrDto && 'constructor' in (entityOrDto as object)) {
      // eslint-disable-next-line @typescript-eslint/ban-types
      const serializer = getAssemblerSerializer(entityOrDto.constructor as Class<unknown>);

      if (serializer) {
        return serializer(entityOrDto);
      }
    }
    return entityOrDto as unknown as object;
  }
}
