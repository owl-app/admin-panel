import { TypeMapper } from 'ts-mapper'

import { UserResponse } from './dto/user.response'
import { User } from '../domain/model/user';

export class Mapper extends TypeMapper {
  constructor() {
    super();
    this.config();
  }

  private config(): void {
    this.createMap<User, UserResponse>()
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
  }
}

const mapper = new Mapper();

export default mapper;
