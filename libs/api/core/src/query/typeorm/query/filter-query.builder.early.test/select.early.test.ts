// Unit tests for: select

import { Query } from '@owl-app/nestjs-query-core';
import { Registry } from '@owl-app/registry';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FilterQuery } from '../../../../registry/interfaces/filter-query';
import { ForceFilters } from '../../../core/interfaces/force-filters.interface';
import { FilterQueryBuilder } from '../filter-query.builder';

// Mock interfaces and classes
interface MockQuery<Entity> extends Query<Entity> {}
class MockRepository<Entity> extends Repository<Entity> {}
interface MockRegistry<Entity> extends Registry<FilterQuery<Entity>> {}
interface MockFilterQuery<Entity> extends FilterQuery<Entity> {}

describe('FilterQueryBuilder.select() select method', () => {
  let mockRepository: MockRepository<any>;
  let mockRegistry: MockRegistry<any>;
  let mockFilterQuery: MockFilterQuery<any>;
  let mockSelectQueryBuilder: SelectQueryBuilder<any>;

  beforeEach(() => {
    mockRepository = new MockRepository() as any;
    mockRegistry = {
      all: jest.fn(),
    } as any;
    mockFilterQuery = {
      supports: jest.fn(),
      execute: jest.fn(),
    } as any;
    mockSelectQueryBuilder = {
      getMany: jest.fn(),
      withDeleted: jest.fn(),
    } as any;
  });

  describe('Happy paths', () => {
    it('should return a SelectQueryBuilder when no filters are applied', () => {
      // Arrange
      const query: MockQuery<any> = {} as any;
      const filterQueryBuilder = new FilterQueryBuilder(mockRepository, undefined as any);
      jest.spyOn(filterQueryBuilder, 'select' as any).mockReturnValue(mockSelectQueryBuilder);

      // Act
      const result = filterQueryBuilder.select(query);

      // Assert
      expect(result).toBe(mockSelectQueryBuilder);
    });

    it('should apply filters that support the repository metadata', () => {
      // Arrange
      const query: MockQuery<any> = {} as any;
      const filters = { testFilter: mockFilterQuery };
      mockRegistry.all.mockReturnValue(filters);
      jest.spyOn(mockFilterQuery, 'supports').mockReturnValue(true);
      const filterQueryBuilder = new FilterQueryBuilder(mockRepository, mockRegistry as any);
      jest.spyOn(filterQueryBuilder, 'select' as any).mockReturnValue(mockSelectQueryBuilder);

      // Act
      filterQueryBuilder.select(query);

      // Assert
      expect(mockFilterQuery.supports).toHaveBeenCalledWith(mockRepository.metadata);
      expect(mockFilterQuery.execute).toHaveBeenCalledWith(mockSelectQueryBuilder);
    });

    it('should apply forced filters even if they do not support the repository metadata', () => {
      // Arrange
      const query: MockQuery<any> = {} as any;
      const filters = { testFilter: mockFilterQuery };
      const opts: ForceFilters = { forceFilters: ['testFilter'] };
      mockRegistry.all.mockReturnValue(filters);
      jest.spyOn(mockFilterQuery, 'supports').mockReturnValue(false);
      const filterQueryBuilder = new FilterQueryBuilder(mockRepository, mockRegistry as any);
      jest.spyOn(filterQueryBuilder, 'select' as any).mockReturnValue(mockSelectQueryBuilder);

      // Act
      filterQueryBuilder.select(query, opts);

      // Assert
      expect(mockFilterQuery.execute).toHaveBeenCalledWith(mockSelectQueryBuilder);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty filters gracefully', () => {
      // Arrange
      const query: MockQuery<any> = {} as any;
      const filterQueryBuilder = new FilterQueryBuilder(mockRepository, mockRegistry as any);
      jest.spyOn(filterQueryBuilder, 'select' as any).mockReturnValue(mockSelectQueryBuilder);
      mockRegistry.all.mockReturnValue({});

      // Act
      const result = filterQueryBuilder.select(query);

      // Assert
      expect(result).toBe(mockSelectQueryBuilder);
      expect(mockFilterQuery.execute).not.toHaveBeenCalled();
    });

    it('should handle undefined filters gracefully', () => {
      // Arrange
      const query: MockQuery<any> = {} as any;
      const filterQueryBuilder = new FilterQueryBuilder(mockRepository, undefined as any);
      jest.spyOn(filterQueryBuilder, 'select' as any).mockReturnValue(mockSelectQueryBuilder);

      // Act
      const result = filterQueryBuilder.select(query);

      // Assert
      expect(result).toBe(mockSelectQueryBuilder);
      expect(mockFilterQuery.execute).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: select
