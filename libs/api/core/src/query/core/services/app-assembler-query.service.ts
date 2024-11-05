
import { DeepPartial, AssemblerQueryService, UpdateOneOptions, Assembler, Filter, WithDeleted } from '@owl-app/nestjs-query-core';
import { AppQueryService } from './app-query.service';

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
    filters?: Filter<DTO>,
    opts?: WithDeleted,
  ): Promise<DTO> {
    const c = this.queryService.createWithRelations(
      await this.assembler.convertToCreateEntity(item),
      this.convertToFilter(filters),
      opts,
    );
    return this.assembler.convertAsyncToDTO(c);
  }

  async updateWithRelations(
    id: number | string | Filter<DTO>,
    update: U,
    opts?: UpdateOneOptions<DTO>
  ): Promise<DTO> {
    const c = this.queryService.updateWithRelations(
      typeof id === 'object' ? this.convertToFilter(id) : id,
      await this.assembler.convertToUpdateEntity(update),
      this.convertFilterable(opts)
    );

    return this.assembler.convertAsyncToDTO(c);
  }

  convertToFilter(query: Filter<DTO>): Filter<Entity> {
    return query as unknown as Filter<Entity>;
  }
}
