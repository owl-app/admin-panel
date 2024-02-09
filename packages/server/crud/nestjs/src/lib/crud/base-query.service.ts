import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm'

import {
  Class,
  Filter,
  QueryService as BaseQueryService,
  DeepPartial,
  AssemblerQueryService,
Query,
QueryOptions
} from '@owl-app/crud-core';
import { isNotEmpty } from '@owl-app/utils'

import { TypeOrmQueryService } from '../services';
import { Pagination, PaginatedRequest, ConfigQuery, QUERY_CONFIG_NAME } from '../pagination'

type DefaultDeepPartial<Cls, T> = unknown extends Cls ? DeepPartial<T> : Cls;

interface QueryWithCountType<T> { (query: Query<T>, opts?: QueryOptions): Promise<[T[], number]> }

const getPagination =  async <T>(
  filter: Filter<T>,
  paginationQuery: PaginatedRequest,
  queryWithCount: QueryWithCountType<T>,
  config: ConfigService
): Promise<Pagination<T>> => {

    const { pagination } = config.get<ConfigQuery>(QUERY_CONFIG_NAME);
    let page = 0;

    if (isNotEmpty(paginationQuery.page) && paginationQuery.page > 0) {
      page = (paginationQuery.page - 1) * paginationQuery.limit;
    }

    const [items, total] = await queryWithCount({
      filter,
      paging: {
        limit: paginationQuery.limit ?? pagination.default_limit,
        offset: page,
      },
    });

    return { items, metadata: { total } };
}

export interface IBaseCRUDService<Entity> extends BaseQueryService<Entity> {
  paginated(
    filter: Filter<Entity>,
    paginationQuery: PaginatedRequest
  ): Promise<Pagination<Entity>>;
}

export const BaseCRUDService =<Entity>(entityClass: Class<Entity>) =>
  <QS extends Class<TypeOrmQueryService<Entity>>>
  (QueryService: QS) => {
    @Injectable()
    abstract class CustomServiceQuery extends QueryService {
      @Inject(ConfigService)
      readonly configService: ConfigService;

      @InjectRepository(entityClass)
      readonly repository: Repository<Entity>

      async paginated(
        filter: Filter<Entity>,
        paginationQuery: PaginatedRequest
      ): Promise<Pagination<Entity>> {
        return getPagination<Entity>(filter, paginationQuery, this.queryWithCount, this.configService)
      }
    }

    return CustomServiceQuery;
  };
  
export const BaseAsyncCRUDService =
  <
    Entity,
    DTO,
    CreateDTO,
    CreateEntity,
    C = DefaultDeepPartial<CreateDTO, DTO>,
    CE = DefaultDeepPartial<CreateEntity, Entity>,
    U = C,
    UE = CE
  >(
    entityClass: Class<Entity>,
    DTOClass?: Class<DTO>,
    CreateDTOClass?: Class<CreateDTO>,
    CreateEntityClass?: Class<CreateEntity>
  ) =>

  <
    QSAssembler extends Class<AssemblerQueryService<DTO, Entity, C, CE, U, UE>>
  >
  (QueryService: QSAssembler) => {
    @Injectable()
    abstract class CustomServiceQuery extends QueryService {
      @Inject(ConfigService)
      readonly configService: ConfigService;

      @InjectRepository(entityClass)
      readonly repository: Repository<Entity>

      async paginated(
        filter: Filter<DTO>,
        paginationQuery: PaginatedRequest
      ): Promise<Pagination<DTO>> {
        return getPagination<DTO>(filter, paginationQuery, this.queryWithCount, this.configService)
      }
    }

    return CustomServiceQuery;
  };