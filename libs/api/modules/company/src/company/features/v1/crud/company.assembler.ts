import { Assembler, DeepPartial, ClassTransformerAssembler } from '@owl-app/crud-core'

import { CompanyEntity } from '../../../../domain/entity/company.entity'
import { CompanyResponse } from '../../../dto/company.response'
import { mapperCompany, mapperUser } from '../../../mapping'

import { CreateCompanyRequest, UpdateCompanyDto } from './dto'
import { RelationUserResponse } from '../../../dto/relation-user.response'


@Assembler(CreateCompanyRequest, CompanyEntity)
export class CompanyAssembler extends ClassTransformerAssembler<
  CreateCompanyRequest,
  CompanyEntity
> {
  async convertAsyncToCreateEntity(dto: CreateCompanyRequest): Promise<DeepPartial<CompanyEntity>> {
    const model = new CompanyEntity();

    model.name = dto.name;
    // model.users = dto.users;

    return model;
  }

  convertToDTO(company: CompanyEntity): CompanyResponse
  {
    const responseCompany = mapperCompany.map<CompanyEntity, CompanyResponse>(company, new CompanyResponse());

    // if(company.users) {
    //   responseCompany.users = company.users.map((user) => mapperUser.map<User, RelationUserResponse>(user, new RelationUserResponse()));
    // }

    return responseCompany
  }

  async convertAsyncToDTO(company: Promise<CompanyEntity>): Promise<CompanyResponse>
  {
    const response = await company;
    const responseCompany = mapperCompany.map<CompanyEntity, CompanyResponse>(response, new CompanyResponse());

    // if(response.users) {
    //   responseCompany.users = response.users.map((user) => mapperUser.map<User, RelationUserResponse>(user, new RelationUserResponse()));
    // }

    return responseCompany
  }
}
