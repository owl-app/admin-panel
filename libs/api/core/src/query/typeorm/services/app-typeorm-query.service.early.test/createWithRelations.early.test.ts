// Unit tests for: createWithRelations

import { Filter } from '@owl-app/nestjs-query-core';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';
import DomainEventableEntity from '../../../../database/entity/domain-eventable.entity';
import { AppTypeOrmQueryService } from '../app-typeorm-query.service';

// Mocking dependencies
type MockDeepPartial = Partial<DomainEventableEntity>;
type MockFilter = Partial<Filter<DomainEventableEntity>>;

class MockFilterQueryBuilder {
  select = jest.fn().mockReturnThis();
  getOne = jest.fn();
  getMany = jest.fn();
}

class MockRepository {
  create = jest.fn();
  save = jest.fn();
  metadata = {
    relations: [] as RelationMetadata[],
    nonVirtualColumns: [],
  };
}

interface MockRegistry<T> {
  all: jest.Mock<Partial<T>>;
}

interface MockFilterQuery {}
interface MockEntitySetter {}

jest.mock('@owl-app/utils', () => {
  const actual = jest.requireActual('@owl-app/utils');
  return {
    ...actual,
    convertToSnakeCase: jest.fn(),
  };
});

describe('AppTypeOrmQueryService.createWithRelations() createWithRelations method', () => {
  let service: AppTypeOrmQueryService<DomainEventableEntity>;
  let mockRepo: MockRepository;
  let mockFilterQueryBuilder: MockFilterQueryBuilder;
  let mockFilters: MockRegistry<MockFilterQuery>;
  let mockSetters: MockRegistry<MockEntitySetter>;

  beforeEach(() => {
    mockRepo = new MockRepository() as any;
    mockFilterQueryBuilder = new MockFilterQueryBuilder() as any;
    mockFilters = { all: jest.fn() } as any;
    mockSetters = { all: jest.fn() } as any;

    service = new AppTypeOrmQueryService(
      mockRepo as any,
      { filterQueryBuilder: mockFilterQueryBuilder } as any,
      mockFilters as any,
      mockSetters as any
    );
  });

  describe('Happy paths', () => {
    it('should create an entity with relations successfully', async () => {
      // Arrange
      const mockEntity = {} as MockDeepPartial;
      mockRepo.create.mockReturnValue(mockEntity);
      mockRepo.save.mockResolvedValue(mockEntity);

      // Act
      const result = await service.createWithRelations(mockEntity as any);

      // Assert
      expect(mockRepo.create).toHaveBeenCalledWith({});
      expect(mockRepo.save).toHaveBeenCalledWith(mockEntity);
      expect(result).toBe(mockEntity);
    });

    it('should handle transactions when repository is TransactionalRepository', async () => {
      // Arrange
      const mockEntity = {} as MockDeepPartial;
      mockRepo.create.mockReturnValue(mockEntity);
      mockRepo.save.mockResolvedValue(mockEntity);
      (mockRepo as any).transaction = jest.fn(async (fn) => fn());

      // Act
      const result = await service.createWithRelations(mockEntity as any);

      // Assert
      expect((mockRepo as any).transaction).toHaveBeenCalled();
      expect(mockRepo.save).toHaveBeenCalledWith(mockEntity);
      expect(result).toBe(mockEntity);
    });
  });

  describe('Edge cases', () => {
    it('should throw an error if entity already exists by filter', async () => {
      // Arrange
      const mockEntity = {} as MockDeepPartial;
      const mockFilter = {} as MockFilter;
      mockFilterQueryBuilder.getOne.mockResolvedValue(mockEntity);

      // Act & Assert
      await expect(
        service.createWithRelations(mockEntity as any, mockFilter as any)
      ).rejects.toThrow('Entity already exists');
    });

    it('should throw an error if repository is not TransactionalRepository', async () => {
      // Arrange
      const mockEntity = {} as MockDeepPartial;
      mockRepo.create.mockReturnValue(mockEntity);
      mockRepo.save.mockResolvedValue(mockEntity);
      delete (mockRepo as any).transaction;

      // Act & Assert
      await expect(service.createWithRelations(mockEntity as any)).rejects.toThrow(
        'Repository should extend by TransactionalRepository'
      );
    });
  });
});

// End of unit tests for: createWithRelations
