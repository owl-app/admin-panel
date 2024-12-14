// Unit tests for: getRelationQueryBuilder

import DomainEventableEntity from '../../../../database/entity/domain-eventable.entity';
import { RelationQueryBuilder } from '../../query/relation-query.builder';
import { AppTypeOrmQueryService } from '../app-typeorm-query.service';

// Mocking convertToSnakeCase function
jest.mock('@owl-app/utils', () => {
  const actual = jest.requireActual('@owl-app/utils');
  return {
    ...actual,
    convertToSnakeCase: jest.fn().mockReturnValue('mocked_snake_case'),
  };
});

// Mock classes and interfaces

class MockRepository {
  metadata = {
    relations: [],
  };
  create = jest.fn();
  save = jest.fn();
  merge = jest.fn();
}

interface MockRegistry {
  all: jest.Mock;
}

interface MockFilterQuery {}

interface MockEntitySetter {
  supports: jest.Mock;
  execute: jest.Mock;
}

type MockDeepPartial<Entity> = Partial<Entity>;

// Test suite for getRelationQueryBuilder method
describe('AppTypeOrmQueryService.getRelationQueryBuilder() getRelationQueryBuilder method', () => {
  let service: AppTypeOrmQueryService<DomainEventableEntity>;
  let mockRepo: MockRepository<DomainEventableEntity>;
  let mockFilters: MockRegistry<MockFilterQuery<DomainEventableEntity>>;
  let mockSetters: MockRegistry<MockEntitySetter<MockDeepPartial<DomainEventableEntity>>>;

  beforeEach(() => {
    mockRepo = new MockRepository() as any;
    mockFilters = { all: jest.fn() } as any;
    mockSetters = { all: jest.fn() } as any;

    service = new AppTypeOrmQueryService(
      mockRepo as any,
      { useTransaction: true } as any,
      mockFilters as any,
      mockSetters as any
    );
  });

  describe('Happy paths', () => {
    it('should return a RelationQueryBuilder instance with correct parameters', () => {
      // Test to ensure the method returns a RelationQueryBuilder with correct parameters
      const relationName = 'testRelation';
      const result = service.getRelationQueryBuilder(relationName);

      expect(result).toBeInstanceOf(RelationQueryBuilder);
      expect(result).toHaveProperty('repo', mockRepo);
      expect(result).toHaveProperty('relationName', relationName);
      expect(result).toHaveProperty('filters', mockFilters);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty relation name gracefully', () => {
      // Test to ensure the method handles empty relation name
      const relationName = '';
      const result = service.getRelationQueryBuilder(relationName);

      expect(result).toBeInstanceOf(RelationQueryBuilder);
      expect(result).toHaveProperty('relationName', relationName);
    });

    it('should handle null relation name gracefully', () => {
      // Test to ensure the method handles null relation name
      const relationName = null;
      const result = service.getRelationQueryBuilder(relationName as any);

      expect(result).toBeInstanceOf(RelationQueryBuilder);
      expect(result).toHaveProperty('relationName', relationName);
    });
  });
});

// End of unit tests for: getRelationQueryBuilder
