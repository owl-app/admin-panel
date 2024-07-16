import { TypeMapper } from 'ts-mapper'

import { UserResponse } from './dto/user.response'
import { UserEntity } from '../domain/entity/user.entity';

export class Mapper extends TypeMapper {
  constructor() {
    super();
    this.config();
  }

  private config(): void {
    this.createMap<UserEntity, UserResponse>()
      .map(
        (src) => src.id,
        (dest) => dest.id
      )
      .map(
        (src) => src.email,
        (dest) => dest.email
      )
      .map(
        (src) => src.firstName,
        (dest) => dest.firstName
      )
      .map(
        (src) => src.lastName,
        (dest) => dest.lastName
      )
      .map(
        (src) => src.phoneNumber,
        (dest) => dest.phoneNumber
      )
  }
}

const mapper = new Mapper();

export default mapper;
