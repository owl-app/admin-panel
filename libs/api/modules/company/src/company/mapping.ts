import { TypeMapper } from 'ts-mapper'

import { CompanyResponse } from './dto/company.response'
import { CompanyModel } from '../domain/model/company';

export class Mapper extends TypeMapper {
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

const mapper = new Mapper();

export default mapper;
