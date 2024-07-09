import { ClassTransformerAsyncAssembler } from '@owl-app/crud-nestjs'
import { Assembler, DeepPartial } from '@owl-app/crud-core'

import { CompanyModel } from '../../../../domain/model/company'
import { CompanyResponse } from '../../../dto/company.response'
import { mapperCompany, mapperUser } from '../../../mapping'

import { CreateCompanyRequest, UpdateCompanyDto } from './dto'
import { RelationUserResponse } from '../../../dto/relation-user.response'
import { IUser } from '@owl-app/lib-contracts'

@Assembler(CompanyResponse, CompanyModel)
export class CompanyModelAssembler extends ClassTransformerAsyncAssembler<
  CompanyResponse,
  CompanyModel,
  CreateCompanyRequest|UpdateCompanyDto
> {
  async convertAsyncToCreateEntity(dto: CreateCompanyRequest): Promise<DeepPartial<CompanyModel>> {
    const model = new CompanyModel();

    model.name = dto.name;
    model.users = dto.users;

    return model;
  }

  convertToDTO(company: CompanyModel): CompanyResponse
  {
    const responseCompany = mapperCompany.map<CompanyModel, CompanyResponse>(company, new CompanyResponse());

    if(company.users) {
      responseCompany.users = company.users.map((user) => mapperUser.map<IUser, RelationUserResponse>(user, new RelationUserResponse()));
    }

    return responseCompany
  }

  async convertAsyncToDTO(company: Promise<CompanyModel>): Promise<CompanyResponse>
  {
    const response = await company;
    const responseCompany = mapperCompany.map<CompanyModel, CompanyResponse>(response, new CompanyResponse());

    if(response.users) {
      responseCompany.users = response.users.map((user) => mapperUser.map<IUser, RelationUserResponse>(user, new RelationUserResponse()));
    }

    return responseCompany
  }
}
