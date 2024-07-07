import { Injectable } from '@nestjs/common'

import { PaginatedRequest, AssemblerAsyncCrudService, Pagination } from '@owl-app/crud-nestjs'
import { InjectQueryService, QueryService } from '@owl-app/crud-core';
import { isEmpty } from '@owl-app/utils'

import { Company } from '../../../../domain/model/company'
import { CompanyResponse } from '../../../dto/company.response'
import mapper from '../../../mapping'

import { CompanyAssembler } from './company.assembler'
import { CreateCompanyRequest, FilterCompanyDto } from './dto'

@Injectable()
export class CompanyService extends AssemblerAsyncCrudService(
  Company,
  CompanyResponse,
  CreateCompanyRequest
) {
  constructor(
    readonly assembler: CompanyAssembler,
    @InjectQueryService(Company) readonly service: QueryService<Company>
  ) {
    super(assembler, service);
  }

  async search(
    filters: FilterCompanyDto,
    pagination: PaginatedRequest
  ): Promise<Pagination<CompanyResponse>> {
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
        items: result.items.map((company) => mapper.map<Company, CompanyResponse>(company, new CompanyResponse()))
    }
  }
}
