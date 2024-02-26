import { TypeMapper } from 'ts-mapper'
import moment from 'moment'

import { Permission } from '@owl-app/rbac-manager';

import { PermissionResponse } from './dto/permission/permission.response.dto';
import { CreatePermissionRequest } from './dto/permission/create-permission.request.dto';
import { UpdatePermissionRequest } from './dto/permission/update-permission.request.dto';

export class MapperToResponse extends TypeMapper {
  constructor() {
    super();
    this.config();
  }

  private config(): void {
    this.createMap<Permission, PermissionResponse>()
      .map(
        (src) => src.name,
        (dest) => dest.name
      )
      .map(
        (src) => src.description,
        (dest) => dest.description
      )
      .map(
        (src) => src.ruleName,
        (dest) => dest.ruleName
      )
      .map(
        (src) => src.createdAt !== null ? moment(src.createdAt).format('YYYY-MM-DD HH:mm:ss') : null,
        (dest) => dest.createdAt
      )
      .map(
        (src) => src.updatedAt !== null ? moment(src.updatedAt).format('YYYY-MM-DD HH:mm:ss') : null,
        (dest) => dest.updatedAt
      )
  }
}

const mapperToResponse = new MapperToResponse();

export class MapperToPersistance extends TypeMapper {
  constructor() {
    super();
    this.config();
  }

  private config(): void {
    this.createMap<CreatePermissionRequest|UpdatePermissionRequest, Permission>()
      .map(
        (src) => src.name,
        (dest) => dest.name
      )
      .map(
        (src) => src.description,
        (dest) => dest.description
      )
      .map(
        (src) => src.ruleName,
        (dest) => dest.ruleName
      )
  }
}

const mapperToPersistance = new MapperToPersistance();

export  { mapperToResponse, mapperToPersistance }
