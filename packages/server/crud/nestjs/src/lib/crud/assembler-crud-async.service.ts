import {
  Class,
  QueryService,
  DeepPartial,
  UpdateOneOptions,
  AssemblerQueryService as BaseAssemblerQueryService,
} from '@owl-app/crud-core';
import { IAssemblerCRUDService } from './assembler-crud.service';
import { BaseCrudService } from './base-query.service';
import { AsyncAssembler } from './async.assembler';

type DefaultDeepPartial<Cls, T> = unknown extends Cls ? DeepPartial<T> : Cls;

export interface IAssemblerAsyncQueryService<
  DTO,
  C,
  U = C
> extends QueryService<DTO, C, U> {
  createAsyncOne(item: C): Promise<DTO>;
  updateAsyncOne(
    id: string | number,
    update: U,
    opts?: UpdateOneOptions<DTO>
  ): Promise<DTO>;
}

export class CustomAssemblerQueryServicey<DTO, Entity, C, CE, U, UE>
  extends BaseAssemblerQueryService<DTO, Entity, C, CE, U, UE>
  implements IAssemblerAsyncQueryService<DTO, C, U>
{
  constructor(
    readonly assembler: AsyncAssembler<DTO, Entity, C, CE, U, UE>,
    readonly queryService: QueryService<Entity, CE, UE>
  ) {
    super(assembler, queryService);
  }

  async createAsyncOne(item: C): Promise<DTO> {
    const c = await this.assembler.convertAsyncToCreateEntity(item);
    return this.assembler.convertAsyncToDTO(this.queryService.createOne(c));
  }

  async updateAsyncOne(
    id: string | number,
    update: U,
    opts?: UpdateOneOptions<DTO>
  ): Promise<DTO> {
    const u = await this.assembler.convertToUpdateEntity(update);
    return this.assembler.convertAsyncToDTO(
      this.queryService.updateOne(id, u, this.convertFilterable(opts))
    );
  }
}

export const AssemblerAsyncCrudService = <
  Entity,
  DTO,
  CreateDTO,
  CreateEntity,
  C = DefaultDeepPartial<CreateDTO, DTO>,
  CE = DefaultDeepPartial<CreateEntity, Entity>,
  U = C,
  UE = CE
>(
  entityClass: Class<Entity>,
  DTOClass: Class<DTO>,
  CreateDTOClass?: Class<CreateDTO>,
  CreateEntityClass?: Class<CreateEntity>
): Class<IAssemblerAsyncQueryService<DTO, C, U>> &
  Class<IAssemblerCRUDService<Entity, DTO>> => BaseCrudService(
    entityClass,
    DTOClass,
    CreateDTOClass,
    CreateEntityClass
  )(CustomAssemblerQueryServicey) as unknown as Class<
    IAssemblerAsyncQueryService<DTO, C, U>
  > &
    Class<IAssemblerCRUDService<Entity, DTO>>
