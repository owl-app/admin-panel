import { TypeMapper } from 'ts-mapper'

import { IUser } from '@owl-app/lib-contracts';

import { CompanyResponse } from './dto/company.response'
import { CompanyModel } from '../domain/model/company';
import { RelationUserResponse } from './dto/relation-user.response';

export class MapperUser extends TypeMapper {
  constructor() {
    super();
    this.config();
  }

  private config(): void {
    this.createMap<IUser, RelationUserResponse>()
      .map(
        (src) => src.id,
        (dest) => dest.id
      )
      .map(
        (src) => src.firstName,
        (dest) => dest.name
      )
      .map(
        (src) => src.lastName,
        (dest) => dest.lastName
      )
  }
}

const mapperUser = new MapperUser();

export class MapperCompany extends TypeMapper {
  constructor() {
    super();
    this.config();
  }

  private config(): void {
    this.createMap<CompanyModel, CompanyResponse>()
      .map(
        (src) => src.id,
        (dest) => dest.id
      )
      .map(
        (src) => src.name,
        (dest) => dest.name
      )
  }
}

const mapperCompany = new MapperCompany();

export { mapperCompany, mapperUser };
