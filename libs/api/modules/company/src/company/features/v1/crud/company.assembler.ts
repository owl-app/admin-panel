import { ClassTransformerAsyncAssembler } from '@owl-app/crud-nestjs'
import { Assembler, DeepPartial } from '@owl-app/crud-core'

import { CompanyModel } from '../../../../domain/model/company'
import { CompanyResponse } from '../../../dto/company.response'
import mapper from '../../../mapping'

import { CreateCompanyRequest } from './dto'

@Assembler(CompanyResponse, CompanyModel)
export class CompanyModelAssembler extends ClassTransformerAsyncAssembler<
  CompanyResponse,
  CompanyModel,
  CreateCompanyRequest
> {
  async convertAsyncToCreateEntity(dto: CreateCompanyRequest): Promise<DeepPartial<CompanyModel>> {
    const model = new CompanyModel();

    model.name = dto.name;
    model.users = dto.users;

    return model;
  }

  convertToDTO(user: CompanyModel): CompanyResponse
  {
    return mapper.map<CompanyModel, CompanyResponse>(user, new CompanyResponse());
  }
}
