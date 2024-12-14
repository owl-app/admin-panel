// Unit tests for: query

import { QueryOptions } from '../../interfaces/query-options';
import { AppAssemblerQueryService } from '../app-assembler-query.service';

// Mock interfaces
class MockQuery {
  // Define necessary properties and methods for the mock
}

class MockAssembler {
  convertAsyncToDTOs = jest.fn();
  convertQuery = jest.fn();
}

class MockAppQueryService {
  query = jest.fn();
}

describe('AppAssemblerQueryService.query() query method', () => {
  let mockAssembler: MockAssembler<any, any, any, any, any, any>;
  let mockQueryService: MockAppQueryService<any, any, any>;
  let service: AppAssemblerQueryService<any, any, any, any, any, any>;

  beforeEach(() => {
    mockAssembler = new MockAssembler() as any;
    mockQueryService = new MockAppQueryService() as any;
    service = new AppAssemblerQueryService(mockAssembler as any, mockQueryService as any);
  });

  describe('Happy paths', () => {
    it('should convert query and return DTOs', async () => {
      // Arrange
      const query = new MockQuery() as any;
      const opts: QueryOptions = {} as any;
      const entities = [{ id: 1 }, { id: 2 }];
      const dtos = [{ id: 'a' }, { id: 'b' }];

      mockQueryService.query.mockResolvedValue(entities as any as never);
      mockAssembler.convertQuery.mockReturnValue(query as any);
      mockAssembler.convertAsyncToDTOs.mockResolvedValue(dtos as any as never);

      // Act
      const result = await service.query(query, opts);

      // Assert
      expect(mockQueryService.query).toHaveBeenCalledWith(query, opts);
      expect(mockAssembler.convertAsyncToDTOs).toHaveBeenCalledWith(entities);
      expect(result).toEqual(dtos);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty query result', async () => {
      // Arrange
      const query = new MockQuery() as any;
      const opts: QueryOptions = {} as any;
      const entities: any[] = [];
      const dtos: any[] = [];

      mockQueryService.query.mockResolvedValue(entities as any as never);
      mockAssembler.convertQuery.mockReturnValue(query as any);
      mockAssembler.convertAsyncToDTOs.mockResolvedValue(dtos as any as never);

      // Act
      const result = await service.query(query, opts);

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle null query options', async () => {
      // Arrange
      const query = new MockQuery() as any;
      const entities = [{ id: 1 }];
      const dtos = [{ id: 'a' }];

      mockQueryService.query.mockResolvedValue(entities as any as never);
      mockAssembler.convertQuery.mockReturnValue(query as any);
      mockAssembler.convertAsyncToDTOs.mockResolvedValue(dtos as any as never);

      // Act
      const result = await service.query(query, null as any);

      // Assert
      expect(result).toEqual(dtos);
    });

    it('should throw an error if query service fails', async () => {
      // Arrange
      const query = new MockQuery() as any;
      const opts: QueryOptions = {} as any;
      const error = new Error('Query service error');

      mockQueryService.query.mockRejectedValue(error as never);
      mockAssembler.convertQuery.mockReturnValue(query as any);

      // Act & Assert
      await expect(service.query(query, opts)).rejects.toThrow('Query service error');
    });
  });
});

// End of unit tests for: query
