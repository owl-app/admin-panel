// Unit tests for: query

import { Query } from '@owl-app/nestjs-query-core';
import { Registry } from '@owl-app/registry';
import { Repository } from 'typeorm';
import DomainEventableEntity from '../../../../database/entity/domain-eventable.entity';
import { EntitySetter } from '../../../../registry/interfaces/entity-setter';
import { FilterQuery } from '../../../../registry/interfaces/filter-query';
import { QueryOptions } from '../../../core/interfaces/query-options';
import { AppTypeOrmQueryService } from '../app-typeorm-query.service';

jest.mock('@owl-app/utils', () => {
  const actual = jest.requireActual('@owl-app/utils');
  return {
    ...actual,
    convertToSnakeCase: jest.fn(),
  };
});

// Mock classes and interfaces
interface MockQuery<Entity> extends Query<Entity> {}
class MockFilterQueryBuilder {
  select = jest.fn().mockReturnThis();
  withDeleted = jest.fn().mockReturnThis();
  getMany = jest.fn();
  getOne = jest.fn();
}
class MockRepository<Entity> extends Repository<Entity> {}
interface MockRegistry<T> extends Registry<T> {}
interface MockFilterQuery<Entity> extends FilterQuery<Entity> {}
interface MockEntitySetter<Entity> extends EntitySetter<Entity> {}
type MockDeepPartial<Entity> = Partial<Entity>;

describe('AppTypeOrmQueryService.query() query method', () => {
  let service: AppTypeOrmQueryService<DomainEventableEntity>;
  let mockRepo: MockRepository<DomainEventableEntity>;
  let mockFilterQueryBuilder: MockFilterQueryBuilder<DomainEventableEntity>;
  let mockFilters: MockRegistry<MockFilterQuery<DomainEventableEntity>>;
  let mockSetters: MockRegistry<MockEntitySetter<MockDeepPartial<DomainEventableEntity>>>;

  beforeEach(() => {
    mockRepo = new MockRepository() as any;
    mockFilterQueryBuilder = new MockFilterQueryBuilder() as any;
    mockFilters = {} as any;
    mockSetters = {} as any;

    service = new AppTypeOrmQueryService(
      mockRepo as any,
      { filterQueryBuilder: mockFilterQueryBuilder } as any,
      mockFilters as any,
      mockSetters as any
    );
  });

  describe('Happy paths', () => {
    it('should return entities when query is successful', async () => {
      const mockEntities = [{ id: 1 }, { id: 2 }];
      mockFilterQueryBuilder.getMany.mockResolvedValue(mockEntities as any);

      const result = await service.query({} as MockQuery<DomainEventableEntity>);

      expect(result).toEqual(mockEntities);
      expect(mockFilterQueryBuilder.select).toHaveBeenCalled();
      expect(mockFilterQueryBuilder.getMany).toHaveBeenCalled();
    });

    it('should handle withDeleted option', async () => {
      const mockEntities = [{ id: 1 }];
      mockFilterQueryBuilder.getMany.mockResolvedValue(mockEntities as any);

      const result = await service.query(
        {} as MockQuery<DomainEventableEntity>,
        { withDeleted: true } as QueryOptions
      );

      expect(result).toEqual(mockEntities);
      expect(mockFilterQueryBuilder.withDeleted).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should return an empty array when no entities match the query', async () => {
      mockFilterQueryBuilder.getMany.mockResolvedValue([] as any);

      const result = await service.query({} as MockQuery<DomainEventableEntity>);

      expect(result).toEqual([]);
      expect(mockFilterQueryBuilder.getMany).toHaveBeenCalled();
    });

    it('should throw an error if the query builder fails', async () => {
      mockFilterQueryBuilder.getMany.mockRejectedValue(new Error('Query failed') as never);

      await expect(service.query({} as MockQuery<DomainEventableEntity>)).rejects.toThrow(
        'Query failed'
      );
    });
  });
});

// End of unit tests for: query
