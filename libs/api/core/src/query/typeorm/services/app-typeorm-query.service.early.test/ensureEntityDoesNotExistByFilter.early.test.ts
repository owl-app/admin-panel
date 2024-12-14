// Unit tests for: ensureEntityDoesNotExistByFilter

import { QueryOptions } from '../../../core/interfaces/query-options';
import { AppTypeOrmQueryService } from '../app-typeorm-query.service';

// Mocking dependencies
type MockFilter = any;
class MockFilterQueryBuilder {
  select = jest.fn().mockReturnThis();
  getOne = jest.fn();
}
class MockRepository {
  metadata = { relations: [] };
}

// Mocking convertToSnakeCase function
jest.mock('@owl-app/utils', () => {
  const actual = jest.requireActual('@owl-app/utils');
  return {
    ...actual,
    convertToSnakeCase: jest.fn(),
  };
});

describe('AppTypeOrmQueryService.ensureEntityDoesNotExistByFilter() ensureEntityDoesNotExistByFilter method', () => {
  let service: AppTypeOrmQueryService<any>;
  let mockRepo: MockRepository;
  let mockFilterQueryBuilder: MockFilterQueryBuilder;

  beforeEach(() => {
    mockRepo = new MockRepository() as any;
    mockFilterQueryBuilder = new MockFilterQueryBuilder() as any;
    service = new AppTypeOrmQueryService(
      mockRepo as any,
      {
        filterQueryBuilder: mockFilterQueryBuilder as any,
      } as any
    );
  });

  describe('Happy paths', () => {
    it('should not throw an error if no entity is found', async () => {
      // Arrange
      mockFilterQueryBuilder.getOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.ensureEntityDoesNotExistByFilter({} as MockFilter, {} as QueryOptions)
      ).resolves.not.toThrow();
    });
  });

  describe('Edge cases', () => {
    it('should throw an error if an entity is found', async () => {
      // Arrange
      const mockEntity = { id: 1 };
      mockFilterQueryBuilder.getOne.mockResolvedValue(mockEntity);

      // Act & Assert
      await expect(
        service.ensureEntityDoesNotExistByFilter({} as MockFilter, {} as QueryOptions)
      ).rejects.toThrow('Entity already exists');
    });

    it('should handle unexpected errors gracefully', async () => {
      // Arrange
      const error = new Error('Unexpected error');
      mockFilterQueryBuilder.getOne.mockRejectedValue(error);

      // Act & Assert
      await expect(
        service.ensureEntityDoesNotExistByFilter({} as MockFilter, {} as QueryOptions)
      ).rejects.toThrow('Unexpected error');
    });
  });
});

// End of unit tests for: ensureEntityDoesNotExistByFilter
