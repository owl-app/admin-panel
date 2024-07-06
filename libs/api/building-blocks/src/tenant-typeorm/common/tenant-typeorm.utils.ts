import {
  AbstractRepository,
  DataSource,
  DataSourceOptions,
  EntitySchema,
  Repository,
} from 'typeorm';
import { getDataSourcePrefix } from '@nestjs/typeorm';
import { Type } from '@nestjs/common';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

import { DEFAULT_DATA_SOURCE_NAME } from '../constants';

/**
 * This function generates an injection token for an Entity or Repository
 * @param {EntityClassOrSchema} entity parameter can either be an Entity or Repository
 * @param {string} [dataSource='default'] DataSource name
 * @returns {string} The Entity | Repository injection token
 */
export function getTenantRepositoryToken(
  entity: EntityClassOrSchema,
  dataSource:
    | DataSource
    | DataSourceOptions
    | string = DEFAULT_DATA_SOURCE_NAME,
): string | Function | Type<DataSource> {
  // if (entity === null || entity === undefined) {
  //   throw new CircularDependencyException('@InjectRepository()');
  // }
  const dataSourcePrefix = getDataSourcePrefix(dataSource);
  if (
    entity instanceof Function &&
    (entity.prototype instanceof Repository ||
      entity.prototype instanceof AbstractRepository)
  ) {
    if (!dataSourcePrefix) {
      return entity;
    }
    return `${dataSourcePrefix}${getCustomRepositoryToken(entity)}`;
  }

  if (entity instanceof EntitySchema) {
    return `${dataSourcePrefix}${
      entity.options.target ? entity.options.target.name : entity.options.name
    }TenantRepository`;
  }
  return `${dataSourcePrefix}${entity.name}TenantRepository`;
}

/**
 * This function generates an injection token for an Entity or Repository
 * @param {Function} This parameter can either be an Entity or Repository
 * @returns {string} The Repository injection token
 */
export function getCustomRepositoryToken(repository: Function): string {
  // if (repository === null || repository === undefined) {
  //   throw new CircularDependencyException('@InjectRepository()');
  // }
  return repository.name;
}



