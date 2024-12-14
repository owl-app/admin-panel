// Unit tests for: select

import { SelectQueryBuilder } from 'typeorm';
import { FilterQueryBuilder } from '../filter-query.builder';
import { RelationQueryBuilder } from '../relation-query.builder';

// Mock classes and interfaces
interface MockQuery {
  filter?: any;
  paging?: any;
  sorting?: any;
}

class MockRepository {
  metadata: any = {};
}

interface MockRegistry<T> {
  all: jest.Mock<() => Record<string, MockFilterQuery<T>>>;
}

interface MockFilterQuery<Relation> {
  supports: jest.Mock<(metadata: any) => boolean>;
  execute: jest.Mock<(qb: SelectQueryBuilder<Relation>) => void>;
}

describe('RelationQueryBuilder.select() select method', () => {
  let mockRepo: MockRepository<any>;
  let mockFilters: MockRegistry<any>;
  let mockFilterQueryBuilder: FilterQueryBuilder<any>;
  let relationQueryBuilder: RelationQueryBuilder<any, any>;

  beforeEach(() => {
    mockRepo = new MockRepository() as any;
    mockFilters = {
      all: jest.fn(),
    } as any;
    mockFilterQueryBuilder = new FilterQueryBuilder(mockRepo, mockFilters) as any;
    relationQueryBuilder = new RelationQueryBuilder(mockRepo, 'relation', mockFilters) as any;
    relationQueryBuilder.filterQueryBuilder = mockFilterQueryBuilder;
  });

  describe('Happy paths', () => {
    it('should return a SelectQueryBuilder when filters are applied', () => {
      // Arrange
      const mockEntity = {};
      const mockQuery: MockQuery = { filter: {} };
      const mockSelectQueryBuilder = {} as SelectQueryBuilder<any>;
      jest
        .spyOn(relationQueryBuilder, 'createRelationQueryBuilder' as any)
        .mockReturnValue(mockSelectQueryBuilder);
      jest.spyOn(mockFilterQueryBuilder, 'applyFilter').mockReturnValue(mockSelectQueryBuilder);
      jest.spyOn(mockFilterQueryBuilder, 'applyPaging').mockReturnValue(mockSelectQueryBuilder);
      jest.spyOn(mockFilterQueryBuilder, 'applySorting').mockReturnValue(mockSelectQueryBuilder);

      // Act
      const result = relationQueryBuilder.select(mockEntity, mockQuery as any);

      // Assert
      expect(result).toBe(mockSelectQueryBuilder);
    });

    it('should execute filters if they support the repository metadata', () => {
      // Arrange
      const mockEntity = {};
      const mockQuery: MockQuery = { filter: {} };
      const mockSelectQueryBuilder = {} as SelectQueryBuilder<any>;
      const mockFilter: MockFilterQuery<any> = {
        supports: jest.fn().mockReturnValue(true),
        execute: jest.fn(),
      };
      mockFilters.all.mockReturnValue({ filter1: mockFilter });
      jest
        .spyOn(relationQueryBuilder, 'createRelationQueryBuilder' as any)
        .mockReturnValue(mockSelectQueryBuilder);

      // Act
      relationQueryBuilder.select(mockEntity, mockQuery as any);

      // Assert
      expect(mockFilter.supports).toHaveBeenCalledWith(mockRepo.metadata);
      expect(mockFilter.execute).toHaveBeenCalledWith(mockSelectQueryBuilder);
    });
  });

  describe('Edge cases', () => {
    it('should handle no filters gracefully', () => {
      // Arrange
      const mockEntity = {};
      const mockQuery: MockQuery = { filter: {} };
      const mockSelectQueryBuilder = {} as SelectQueryBuilder<any>;
      mockFilters.all.mockReturnValue({});
      jest
        .spyOn(relationQueryBuilder, 'createRelationQueryBuilder' as any)
        .mockReturnValue(mockSelectQueryBuilder);

      // Act
      const result = relationQueryBuilder.select(mockEntity, mockQuery as any);

      // Assert
      expect(result).toBe(mockSelectQueryBuilder);
    });

    it('should not execute filters that do not support the repository metadata', () => {
      // Arrange
      const mockEntity = {};
      const mockQuery: MockQuery = { filter: {} };
      const mockSelectQueryBuilder = {} as SelectQueryBuilder<any>;
      const mockFilter: MockFilterQuery<any> = {
        supports: jest.fn().mockReturnValue(false),
        execute: jest.fn(),
      };
      mockFilters.all.mockReturnValue({ filter1: mockFilter });
      jest
        .spyOn(relationQueryBuilder, 'createRelationQueryBuilder' as any)
        .mockReturnValue(mockSelectQueryBuilder);

      // Act
      relationQueryBuilder.select(mockEntity, mockQuery as any);

      // Assert
      expect(mockFilter.supports).toHaveBeenCalledWith(mockRepo.metadata);
      expect(mockFilter.execute).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: select
