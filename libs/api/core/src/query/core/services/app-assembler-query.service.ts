
import { DeepPartial, AssemblerQueryService, UpdateOneOptions, ModifyRelationOptions, Assembler } from '@owl-app/nestjs-query-core';
import { AppQueryService } from './app-query.service';

// eslint-disable-next-line import/prefer-default-export
export class AppAssemblerQueryService<
DTO,
Entity,
C = DeepPartial<DTO>,
CE = DeepPartial<Entity>,
U = C,
UE = CE
> extends AssemblerQueryService<DTO, Entity, C, CE, U, UE> implements AppQueryService<DTO, C, U>
{
  constructor(
    readonly assembler: Assembler<DTO, Entity, C, CE, U, UE>,
    readonly queryService: AppQueryService<Entity, CE, UE>
  ) {
    super(assembler, queryService);
  }

  async createWithRelations(
    item: C,
    relations: Record<string, (string | number)[]>
  ): Promise<DTO> {
    const c = await this.queryService.createWithRelations(
      await this.assembler.convertToCreateEntity(item),
      relations
    );
    return this.assembler.convertToDTO(c);
  }

  async updateWithRelations(
    id: number | string,
    update: U,
    relations: Record<string, (string | number)[]>,
    opts?: UpdateOneOptions<DTO>
  ): Promise<DTO> {
    const c = await this.queryService.updateWithRelations(
      id,
      await this.assembler.convertToUpdateEntity(update),
      relations,
      this.convertFilterable(opts)
    );

    return this.assembler.convertToDTO(c);
  }

  assignRelations<Relation>(
    entity: DTO,
    id: string | number,
    relationIds: (string | number)[],
    opts?: ModifyRelationOptions<DTO, Relation>
  ): Promise<DTO> {
    return this.assembler.convertAsyncToDTO(
      this.queryService.assignRelations(
        this.assembler.convertToEntity(entity),
        id,
        relationIds,
        this.convertModifyRelationsOptions(opts)
      )
    );
  }
}
