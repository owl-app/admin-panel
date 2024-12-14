// Unit tests for: updateOne

import { NotFoundException } from '@nestjs/common';
import DomainEventableEntity from '../../../../database/entity/domain-eventable.entity';
import { AppTypeOrmQueryService } from '../app-typeorm-query.service';

// Mocking dependencies
type MockDeepPartial = { [key: string]: any };
class MockFilterQueryBuilder {
  select = jest.fn().mockReturnThis();
  withDeleted = jest.fn().mockReturnThis();
  getMany = jest.fn().mockResolvedValue([]);
  getOne = jest.fn().mockResolvedValue(null);
}
class MockRepository {
  merge = jest.fn();
  save = jest.fn().mockResolvedValue({});
  metadata = { nonVirtualColumns: [], relations: [] };
}
interface MockRegistry<T> {
  all: () => T[];
}
interface MockFilterQuery {
  [key: string]: any;
}
interface MockEntitySetter {
  supports: jest.Mock;
  execute: jest.Mock;
}

// Mocking convertToSnakeCase function
jest.mock('@owl-app/utils', () => {
  const actual = jest.requireActual('@owl-app/utils');
  return {
    ...actual,
    convertToSnakeCase: jest.fn().mockReturnValue('mocked_event_name'),
  };
});

describe('AppTypeOrmQueryService.updateOne() updateOne method', () => {
  let service: AppTypeOrmQueryService<DomainEventableEntity>;
  let mockRepo: MockRepository;
  let mockFilterQueryBuilder: MockFilterQueryBuilder;
  let mockRegistry: MockRegistry<MockFilterQuery>;
  let mockSetters: MockRegistry<MockEntitySetter>;

  beforeEach(() => {
    mockRepo = new MockRepository() as any;
    mockFilterQueryBuilder = new MockFilterQueryBuilder() as any;
    mockRegistry = { all: jest.fn().mockReturnValue([]) } as any;
    mockSetters = { all: jest.fn().mockReturnValue([]) } as any;

    service = new AppTypeOrmQueryService(
      mockRepo as any,
      { filterQueryBuilder: mockFilterQueryBuilder } as any,
      mockRegistry as any,
      mockSetters as any
    );
  });

  describe('Happy paths', () => {
    it('should update an entity successfully', async () => {
      // Arrange
      const id = 1;
      const updateData: MockDeepPartial = { name: 'Updated Name' };
      const existingEntity = { id, name: 'Old Name' };
      mockRepo.save.mockResolvedValue({ ...existingEntity, ...updateData });
      mockRepo.merge.mockImplementation((entity, update) => Object.assign(entity, update));
      mockFilterQueryBuilder.getOne.mockResolvedValue(existingEntity);

      // Act
      const result = await service.updateOne(id, updateData as any);

      // Assert
      expect(mockRepo.merge).toHaveBeenCalledWith(existingEntity, updateData);
      expect(mockRepo.save).toHaveBeenCalledWith(existingEntity);
      expect(result).toEqual({ ...existingEntity, ...updateData });
    });
  });

  describe('Edge cases', () => {
    it('should throw NotFoundException if entity does not exist', async () => {
      // Arrange
      const id = 1;
      const updateData: MockDeepPartial = { name: 'Updated Name' };
      mockFilterQueryBuilder.getOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.updateOne(id, updateData as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw error if repository is not TransactionalRepository when useTransaction is true', async () => {
      // Arrange
      const id = 1;
      const updateData: MockDeepPartial = { name: 'Updated Name' };
      const existingEntity = { id, name: 'Old Name' };
      mockRepo.save.mockResolvedValue({ ...existingEntity, ...updateData });
      mockRepo.merge.mockImplementation((entity, update) => Object.assign(entity, update));
      mockFilterQueryBuilder.getOne.mockResolvedValue(existingEntity);
      (service as any).useTransaction = true;

      // Act & Assert
      await expect(service.updateOne(id, updateData as any)).rejects.toThrow(
        'Repository should extend by TransactionalRepository'
      );
    });
  });
});

// End of unit tests for: updateOne
