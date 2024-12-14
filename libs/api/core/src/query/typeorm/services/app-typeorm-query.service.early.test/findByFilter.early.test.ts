// Unit tests for: findByFilter

import { NotFoundException } from '@nestjs/common';
import { Filter, WithDeleted } from '@owl-app/nestjs-query-core';
import DomainEventableEntity from '../../../../database/entity/domain-eventable.entity';
import { AppTypeOrmQueryService } from '../app-typeorm-query.service';

// Mocking convertToSnakeCase function
jest.mock('@owl-app/utils', () => {
  const actual = jest.requireActual('@owl-app/utils');
  return {
    ...actual,
    convertToSnakeCase: jest.fn().mockReturnValue('mocked_snake_case'),
  };
});

// Mock classes and types
type MockFilter = Filter<any>;
class MockFilterQueryBuilder {
  select = jest.fn().mockReturnThis();
  withDeleted = jest.fn().mockReturnThis();
  getOne = jest.fn();
}
class MockRepository {
  metadata = { relations: [] };
}
interface MockRegistry {}
interface MockFilterQuery {}
interface MockEntitySetter {}

describe('AppTypeOrmQueryService.findByFilter() findByFilter method', () => {
  let service: AppTypeOrmQueryService<DomainEventableEntity>;
  let mockRepo: MockRepository;
  let mockFilterQueryBuilder: MockFilterQueryBuilder;
  let mockFilters: MockRegistry<MockFilterQuery>;
  let mockSetters: MockRegistry<MockEntitySetter>;

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
    it('should return an entity when found', async () => {
      // Arrange
      const mockEntity = { id: 1 } as DomainEventableEntity;
      mockFilterQueryBuilder.getOne.mockResolvedValue(mockEntity);

      // Act
      const result = await service.findByFilter({} as MockFilter);

      // Assert
      expect(result).toEqual(mockEntity);
      expect(mockFilterQueryBuilder.select).toHaveBeenCalledWith({ filter: {} });
      expect(mockFilterQueryBuilder.getOne).toHaveBeenCalled();
    });

    it('should return an entity with deleted when withDeleted option is true', async () => {
      // Arrange
      const mockEntity = { id: 1 } as DomainEventableEntity;
      mockFilterQueryBuilder.getOne.mockResolvedValue(mockEntity);

      // Act
      const result = await service.findByFilter(
        {} as MockFilter,
        { withDeleted: true } as WithDeleted
      );

      // Assert
      expect(result).toEqual(mockEntity);
      expect(mockFilterQueryBuilder.withDeleted).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should throw NotFoundException when no entity is found', async () => {
      // Arrange
      mockFilterQueryBuilder.getOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findByFilter({} as MockFilter)).rejects.toThrow(NotFoundException);
    });

    it('should handle complex filter structures', async () => {
      // Arrange
      const complexFilter: MockFilter = { and: [{ field: { eq: 'value' } }] } as any;
      const mockEntity = { id: 1 } as DomainEventableEntity;
      mockFilterQueryBuilder.getOne.mockResolvedValue(mockEntity);

      // Act
      const result = await service.findByFilter(complexFilter);

      // Assert
      expect(result).toEqual(mockEntity);
      expect(mockFilterQueryBuilder.select).toHaveBeenCalledWith({ filter: complexFilter });
    });
  });
});

// End of unit tests for: findByFilter
