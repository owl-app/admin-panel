// Unit tests for: createWithRelations

import { QueryOptions } from '../../interfaces/query-options';
import { AppAssemblerQueryService } from '../app-assembler-query.service';

// Mock types and interfaces
type MockFilter = {
  someFilterProperty: string;
};

interface MockAssembler {
  convertToCreateEntity: jest.Mock;
  convertAsyncToDTO: jest.Mock;
}

interface MockAppQueryService {
  createWithRelations: jest.Mock;
}

// Test suite for createWithRelations method
describe('AppAssemblerQueryService.createWithRelations() createWithRelations method', () => {
  let mockAssembler: MockAssembler<any, any, any, any, any, any>;
  let mockQueryService: MockAppQueryService<any, any, any>;
  let service: AppAssemblerQueryService<any, any, any, any, any, any>;

  beforeEach(() => {
    mockAssembler = {
      convertToCreateEntity: jest.fn(),
      convertAsyncToDTO: jest.fn(),
    };

    mockQueryService = {
      createWithRelations: jest.fn(),
    };

    service = new AppAssemblerQueryService(mockAssembler as any, mockQueryService as any);
  });

  describe('Happy paths', () => {
    it('should create an entity with relations successfully', async () => {
      // Arrange
      const item = { someProperty: 'value' };
      const convertedEntity = { convertedProperty: 'convertedValue' };
      const createdEntity = { createdProperty: 'createdValue' };
      const expectedDTO = { dtoProperty: 'dtoValue' };

      mockAssembler.convertToCreateEntity.mockResolvedValue(convertedEntity as any);
      mockQueryService.createWithRelations.mockResolvedValue(createdEntity as any);
      mockAssembler.convertAsyncToDTO.mockResolvedValue(expectedDTO as any);

      // Act
      const result = await service.createWithRelations(item as any);

      // Assert
      expect(mockAssembler.convertToCreateEntity).toHaveBeenCalledWith(item);
      expect(mockQueryService.createWithRelations).toHaveBeenCalledWith(
        convertedEntity,
        undefined,
        undefined
      );
      expect(mockAssembler.convertAsyncToDTO).toHaveBeenCalledWith(createdEntity);
      expect(result).toEqual(expectedDTO);
    });

    it('should handle optional filter and options', async () => {
      // Arrange
      const item = { someProperty: 'value' };
      const filter: MockFilter = { someFilterProperty: 'filterValue' };
      const opts: QueryOptions = { someOption: 'optionValue' };
      const convertedEntity = { convertedProperty: 'convertedValue' };
      const createdEntity = { createdProperty: 'createdValue' };
      const expectedDTO = { dtoProperty: 'dtoValue' };

      mockAssembler.convertToCreateEntity.mockResolvedValue(convertedEntity as any);
      mockQueryService.createWithRelations.mockResolvedValue(createdEntity as any);
      mockAssembler.convertAsyncToDTO.mockResolvedValue(expectedDTO as any);

      // Act
      const result = await service.createWithRelations(item as any, filter as any, opts);

      // Assert
      expect(mockAssembler.convertToCreateEntity).toHaveBeenCalledWith(item);
      expect(mockQueryService.createWithRelations).toHaveBeenCalledWith(
        convertedEntity,
        filter,
        opts
      );
      expect(mockAssembler.convertAsyncToDTO).toHaveBeenCalledWith(createdEntity);
      expect(result).toEqual(expectedDTO);
    });
  });

  describe('Edge cases', () => {
    it('should handle conversion failure gracefully', async () => {
      // Arrange
      const item = { someProperty: 'value' };
      const error = new Error('Conversion failed');

      mockAssembler.convertToCreateEntity.mockRejectedValue(error);

      // Act & Assert
      await expect(service.createWithRelations(item as any)).rejects.toThrow('Conversion failed');
      expect(mockAssembler.convertToCreateEntity).toHaveBeenCalledWith(item);
      expect(mockQueryService.createWithRelations).not.toHaveBeenCalled();
      expect(mockAssembler.convertAsyncToDTO).not.toHaveBeenCalled();
    });

    it('should handle creation failure gracefully', async () => {
      // Arrange
      const item = { someProperty: 'value' };
      const convertedEntity = { convertedProperty: 'convertedValue' };
      const error = new Error('Creation failed');

      mockAssembler.convertToCreateEntity.mockResolvedValue(convertedEntity as any);
      mockQueryService.createWithRelations.mockRejectedValue(error);

      // Act & Assert
      await expect(service.createWithRelations(item as any)).rejects.toThrow('Creation failed');
      expect(mockAssembler.convertToCreateEntity).toHaveBeenCalledWith(item);
      expect(mockQueryService.createWithRelations).toHaveBeenCalledWith(
        convertedEntity,
        undefined,
        undefined
      );
      expect(mockAssembler.convertAsyncToDTO).not.toHaveBeenCalled();
    });
  });
});

// End of unit tests for: createWithRelations
