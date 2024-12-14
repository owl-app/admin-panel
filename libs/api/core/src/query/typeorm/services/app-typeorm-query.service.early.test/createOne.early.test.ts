
// Unit tests for: createOne


import { AppTypeOrmQueryService } from '../app-typeorm-query.service';
import { TransactionalRepository } from '../../../../database/repository/transactional.repository';
import DomainEventableEntity from '../../../../database/entity/domain-eventable.entity';

// Mocking the convertToSnakeCase function
jest.mock("@owl-app/utils", () => {
  const actual = jest.requireActual("@owl-app/utils");
  return {
    ...actual,
    convertToSnakeCase: jest.fn(),
  };
});

// Mock classes and interfaces
type MockDeepPartial<T> = Partial<T>;

class MockFilterQueryBuilder {
  select = jest.fn().mockReturnThis();
  getOne = jest.fn();
  getMany = jest.fn();
  withDeleted = jest.fn().mockReturnThis();
}

class MockRepository {
  save = jest.fn();
  create = jest.fn();
  transaction = jest.fn();
  metadata = {
    relations: [],
    nonVirtualColumns: [],
  };
}

interface MockRegistry {
  all: jest.fn();
}

interface MockFilterQuery {}

interface MockEntitySetter {
  supports: jest.fn();
  execute: jest.fn();
}

describe('AppTypeOrmQueryService.createOne() createOne method', () => {
  let service: AppTypeOrmQueryService<DomainEventableEntity>;
  let mockRepo: MockRepository<DomainEventableEntity>;
  let mockFilterQueryBuilder: MockFilterQueryBuilder<DomainEventableEntity>;
  let mockFilters: MockRegistry<MockFilterQuery<DomainEventableEntity>>;
  let mockSetters: MockRegistry<MockEntitySetter<MockDeepPartial<DomainEventableEntity>>>;

  beforeEach(() => {
    mockRepo = new MockRepository<DomainEventableEntity>() as any;
    mockFilterQueryBuilder = new MockFilterQueryBuilder<DomainEventableEntity>() as any;
    mockFilters = { all: jest.fn() } as any;
    mockSetters = { all: jest.fn() } as any;

    service = new AppTypeOrmQueryService<DomainEventableEntity>(
      mockRepo as any,
      { filterQueryBuilder: mockFilterQueryBuilder } as any,
      mockFilters as any,
      mockSetters as any
    );
  });

  describe('Happy paths', () => {
    it('should create an entity successfully without transaction', async () => {
      // Arrange
      const mockEntity = new DomainEventableEntity();
      mockRepo.save.mockResolvedValue(mockEntity as any);

      // Act
      const result = await service.createOne(mockEntity as any);

      // Assert
      expect(mockRepo.save).toHaveBeenCalledWith(mockEntity);
      expect(result).toBe(mockEntity);
    });

    it('should create an entity successfully with transaction', async () => {
      // Arrange
      const mockEntity = new DomainEventableEntity();
      (mockRepo as any) instanceof TransactionalRepository;
      mockRepo.transaction.mockImplementation(async (fn) => fn());
      mockRepo.save.mockResolvedValue(mockEntity as any);

      // Act
      const result = await service.createOne(mockEntity as any);

      // Assert
      expect(mockRepo.transaction).toHaveBeenCalled();
      expect(mockRepo.save).toHaveBeenCalledWith(mockEntity);
      expect(result).toBe(mockEntity);
    });
  });

  describe('Edge cases', () => {
    it('should throw an error if repository is not transactional', async () => {
      // Arrange
      const mockEntity = new DomainEventableEntity();
      service.useTransaction = true;

      // Act & Assert
      await expect(service.createOne(mockEntity as any)).rejects.toThrow(
        'Repository should extend by TransactionalRepository'
      );
    });

    it('should handle entity already existing', async () => {
      // Arrange
      const mockEntity = new DomainEventableEntity();
      jest.spyOn(service as any, 'ensureIsEntityAndDoesNotExist').mockResolvedValue(null);

      // Act & Assert
      await expect(service.createOne(mockEntity as any)).rejects.toThrow(
        'Entity already exists'
      );
    });
  });
});

// End of unit tests for: createOne
