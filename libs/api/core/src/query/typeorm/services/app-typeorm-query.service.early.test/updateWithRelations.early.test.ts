
// Unit tests for: updateWithRelations


import { AppTypeOrmQueryService } from '../app-typeorm-query.service';
import DomainEventableEntity from '../../../../database/entity/domain-eventable.entity';
import { NotFoundException } from "@nestjs/common";

// Mocking dependencies
type MockFilter = any;
type MockDeepPartial = any;

class MockFilterQueryBuilder {
  select = jest.fn().mockReturnThis();
  getOne = jest.fn();
  getMany = jest.fn();
}

class MockRepository {
  metadata = {
    relations: [],
    nonVirtualColumns: [],
  };
  create = jest.fn();
  save = jest.fn();
  merge = jest.fn();
}

interface MockRegistry {
  all: jest.fn();
}

interface MockFilterQuery {}

interface MockEntitySetter {
  supports: jest.fn();
  execute: jest.fn();
}

// Mocking convertToSnakeCase function
jest.mock("@owl-app/utils", () => {
  const actual = jest.requireActual("@owl-app/utils");
  return {
    ...actual,
    convertToSnakeCase: jest.fn(),
  };
});

describe('AppTypeOrmQueryService.updateWithRelations() updateWithRelations method', () => {
  let service: AppTypeOrmQueryService<DomainEventableEntity>;
  let mockRepo: MockRepository<DomainEventableEntity>;
  let mockFilterQueryBuilder: MockFilterQueryBuilder<DomainEventableEntity>;
  let mockFilters: MockRegistry<MockFilterQuery<DomainEventableEntity>>;
  let mockSetters: MockRegistry<MockEntitySetter<MockDeepPartial>>;

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
    it('should update an entity with relations successfully', async () => {
      // Arrange
      const id = 1;
      const update = { name: 'Updated Name' } as MockDeepPartial;
      const entity = { id, name: 'Old Name' } as DomainEventableEntity;
      mockRepo.save.mockResolvedValue(entity);
      mockRepo.merge.mockImplementation((e, u) => Object.assign(e, u));
      jest.spyOn(service, 'getById' as any).mockResolvedValue(entity);

      // Act
      const result = await service.updateWithRelations(id, update);

      // Assert
      expect(result).toEqual(entity);
      expect(mockRepo.save).toHaveBeenCalledWith(entity);
    });
  });

  describe('Edge cases', () => {
    it('should throw NotFoundException if entity is not found by filter', async () => {
      // Arrange
      const filter = { name: { eq: 'Non-existent' } } as MockFilter;
      mockFilterQueryBuilder.getOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.updateWithRelations(filter, {} as MockDeepPartial)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw an error if repository is not a TransactionalRepository', async () => {
      // Arrange
      const id = 1;
      const update = { name: 'Updated Name' } as MockDeepPartial;
      const entity = { id, name: 'Old Name' } as DomainEventableEntity;
      mockRepo.save.mockResolvedValue(entity);
      mockRepo.merge.mockImplementation((e, u) => Object.assign(e, u));
      jest.spyOn(service, 'getById' as any).mockResolvedValue(entity);
      service.useTransaction = true;

      // Act & Assert
      await expect(service.updateWithRelations(id, update)).rejects.toThrow(
        'Repository should extend by TransactionalRepository'
      );
    });
  });
});

// End of unit tests for: updateWithRelations
