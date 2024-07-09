import { ClassTransformerAsyncAssembler } from '@owl-app/crud-nestjs'
import { Assembler, DeepPartial } from '@owl-app/crud-core'

import { Company } from '../../../../domain/model/company'
import { CompanyResponse } from '../../../dto/company.response'
import mapper from '../../../mapping'

import { CreateCompanyRequest } from './dto'

@Assembler(CompanyResponse, Company)
export class CompanyAssembler extends ClassTransformerAsyncAssembler<
  CompanyResponse,
  Company,
  CreateCompanyRequest
> {
  async convertAsyncToCreateEntity(dto: CreateCompanyRequest): Promise<DeepPartial<Company>> {
    const model = new Company();

    model.name = dto.name;
    model.users = dto.users;

    return model;
  }

  convertToDTO(user: Company): CompanyResponse
  {
    return mapper.map<Company, CompanyResponse>(user, new CompanyResponse());
  }
}
