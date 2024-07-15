import { Injectable } from '@nestjs/common'

import { PaginatedRequest, AssemblerAsyncCrudService, Pagination } from '@owl-app/crud-nestjs'
import { InjectQueryService, QueryService } from '@owl-app/crud-core';
import { isEmpty } from '@owl-app/utils'

import { ClientEntity } from '../../../../domain/entity/client.entity'
import { ClientResponse } from '../../../dto/client.response'

import { ClientModelAssembler } from './client.assembler'
import { CreateClientRequest, FilterClientDto } from './dto'

@Injectable()
export class ClientService extends AssemblerAsyncCrudService(
  ClientEntity,
  ClientResponse,
  CreateClientRequest
) {
  constructor(
    readonly assembler: ClientModelAssembler,
    @InjectQueryService(ClientEntity) readonly service: QueryService<ClientEntity>
  ) {
    super(assembler, service);
  }

  async search(
    filters: FilterClientDto,
    pagination: PaginatedRequest
  ): Promise<Pagination<ClientResponse>> {
    const availableFilters = [];

    // if (!isEmpty(filters.email)) {
    //   availableFilters.push({
    //     email: { like: '%' + filters.email + '%' },
    //   });
    // }

    // if (!isEmpty(filters.firstName)) {
    //   availableFilters.push({
    //     firstName: { like: '%' + filters.firstName + '%' },
    //   });
    // }

    // if (!isEmpty(filters.lastName)) {
    //   availableFilters.push({
    //     lastName: { like: '%' + filters.lastName + '%' },
    //   });
    // }

    const result = await this.paginated(
      {
        // or: availableFilters,
      },
      pagination
    );

    return {
        ...result,
        items: result.items,
    }
  }
}
