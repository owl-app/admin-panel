// Unit tests for: assingRelations

import { AppTypeOrmQueryService } from '../app-typeorm-query.service';
import DomainEventableEntity from '../../../../database/entity/domain-eventable.entity';

// Mock implementations
type MockDeepPartial<T> = Partial<T>;

class MockRelationMetadata {
  getEntityValue = jest.fn();
  setEntityValue = jest.fn();
  inverseEntityMetadata = {
    compareEntities: jest.fn(),
    findInheritanceMetadata: jest.fn(),
    getEntityIdMap: jest.fn(),
  };
  propertyName = 'mockProperty';
  isOneToMany = false;
  isManyToMany = false;
}

class MockFilterQueryBuilder {
  select = jest.fn().mockReturnThis();
  getMany = jest.fn();
  getOne = jest.fn();
  withDeleted = jest.fn().mockReturnThis();
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

// Mock convertToSnakeCase function
jest.mock('@owl-app/utils', () => {
  const actual = jest.requireActual('@owl-app/utils');
  return {
    ...actual,
    convertToSnakeCase: jest.fn(),
  };
});

describe('AppTypeOrmQueryService.assingRelations() assingRelations method', () => {
  let service: AppTypeOrmQueryService<DomainEventableEntity>;
  let mockRepo: MockRepository<DomainEventableEntity>;
  let mockFilterQueryBuilder: MockFilterQueryBuilder<DomainEventableEntity>;
  let mockRelationMetadata: MockRelationMetadata;

  beforeEach(() => {
    mockRepo = new MockRepository() as any;
    mockFilterQueryBuilder = new MockFilterQueryBuilder() as any;
    mockRelationMetadata = new MockRelationMetadata() as any;

    service = new AppTypeOrmQueryService(
      mockRepo as any,
      { filterQueryBuilder: mockFilterQueryBuilder } as any,
      {} as any,
      {} as any
    );
  });

  describe('Happy paths', () => {
    it('should assign new relations correctly', async () => {
      // Arrange
      const entity = {} as DomainEventableEntity;
      const update = {} as MockDeepPartial<DomainEventableEntity>;
      const existingRelations = [];
      const newRelations = [{}];

      mockRelationMetadata.getEntityValue.mockReturnValueOnce(existingRelations);
      mockRelationMetadata.getEntityValue.mockReturnValueOnce(newRelations);
      mockRelationMetadata.inverseEntityMetadata.compareEntities.mockReturnValue(false);
      mockFilterQueryBuilder.getMany.mockResolvedValue(newRelations as any);

      // Act
      await service.assingRelations(entity, update, mockRelationMetadata as any);

      // Assert
      expect(mockRelationMetadata.setEntityValue).toHaveBeenCalledWith(entity, newRelations);
    });

    it('should handle empty new relations gracefully', async () => {
      // Arrange
      const entity = {} as DomainEventableEntity;
      const update = {} as MockDeepPartial<DomainEventableEntity>;
      const existingRelations = [{}];
      const newRelations = [];

      mockRelationMetadata.getEntityValue.mockReturnValueOnce(existingRelations);
      mockRelationMetadata.getEntityValue.mockReturnValueOnce(newRelations);
      mockRelationMetadata.inverseEntityMetadata.compareEntities.mockReturnValue(true);

      // Act
      await service.assingRelations(entity, update, mockRelationMetadata as any);

      // Assert
      expect(mockRelationMetadata.setEntityValue).toHaveBeenCalledWith(entity, existingRelations);
    });
  });

  describe('Edge cases', () => {
    it('should throw an error if unable to find all new relations', async () => {
      // Arrange
      const entity = {} as DomainEventableEntity;
      const update = {} as MockDeepPartial<DomainEventableEntity>;
      const existingRelations = [];
      const newRelations = [{}];

      mockRelationMetadata.getEntityValue.mockReturnValueOnce(existingRelations);
      mockRelationMetadata.getEntityValue.mockReturnValueOnce(newRelations);
      mockRelationMetadata.inverseEntityMetadata.compareEntities.mockReturnValue(false);
      mockFilterQueryBuilder.getMany.mockResolvedValue([]);

      // Act & Assert
      await expect(
        service.assingRelations(entity, update, mockRelationMetadata as any)
      ).rejects.toThrowError(
        `Unable to find all ${mockRelationMetadata.propertyName} to add to ${service.EntityClassName}`
      );
    });

    it('should handle undefined objectRelatedValue gracefully', async () => {
      // Arrange
      const entity = {} as DomainEventableEntity;
      const update = {} as MockDeepPartial<DomainEventableEntity>;

      mockRelationMetadata.getEntityValue.mockReturnValueOnce(undefined);

      // Act
      await service.assingRelations(entity, update, mockRelationMetadata as any);

      // Assert
      expect(mockRelationMetadata.setEntityValue).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: assingRelations
