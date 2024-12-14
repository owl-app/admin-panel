// Unit tests for: updateWithRelations

import { Filter, Query } from '@owl-app/nestjs-query-core';
import { QueryOptions } from '../../interfaces/query-options';
import { AppAssemblerQueryService } from '../app-assembler-query.service';

// Mock implementations
type MockFilter = {
  someProperty: string;
};

interface MockAssembler<DTO, Entity, C, CE, U, UE> {
  convertAsyncToDTOs: jest.Mock<Promise<DTO[]>, [Promise<Entity[]>]>;
  convertToCreateEntity: jest.Mock<Promise<CE>, [C]>;
  convertToUpdateEntity: jest.Mock<Promise<UE>, [U]>;
  convertAsyncToDTO: jest.Mock<Promise<DTO>, [Promise<Entity>]>;
  convertQuery: jest.Mock<Query<Entity>, [Query<DTO>]>;
}

interface MockAppQueryService<Entity, CE, UE> {
  query: jest.Mock<Promise<Entity[]>, [Query<Entity>, QueryOptions?]>;
  createWithRelations: jest.Mock<Promise<Entity>, [CE, Filter<Entity>, QueryOptions?]>;
  updateWithRelations: jest.Mock<
    Promise<Entity>,
    [number | string | Filter<Entity>, UE, QueryOptions?]
  >;
}

describe('AppAssemblerQueryService.updateWithRelations() updateWithRelations method', () => {
  let mockAssembler: MockAssembler<any, any, any, any, any, any>;
  let mockQueryService: MockAppQueryService<any, any, any>;
  let service: AppAssemblerQueryService<any, any, any, any, any, any>;

  beforeEach(() => {
    mockAssembler = {
      convertAsyncToDTOs: jest.fn(),
      convertToCreateEntity: jest.fn(),
      convertToUpdateEntity: jest.fn(),
      convertAsyncToDTO: jest.fn(),
      convertQuery: jest.fn(),
    };

    mockQueryService = {
      query: jest.fn(),
      createWithRelations: jest.fn(),
      updateWithRelations: jest.fn(),
    };

    service = new AppAssemblerQueryService(mockAssembler as any, mockQueryService as any);
  });

  describe('Happy paths', () => {
    it('should update an entity with relations and return the DTO', async () => {
      // Arrange
      const id = 1;
      const update = { someField: 'newValue' };
      const updatedEntity = { id: 1, someField: 'newValue' };
      const expectedDTO = { id: 1, someField: 'newValue' };

      mockAssembler.convertToUpdateEntity.mockResolvedValue(updatedEntity as any);
      mockQueryService.updateWithRelations.mockResolvedValue(updatedEntity as any);
      mockAssembler.convertAsyncToDTO.mockResolvedValue(expectedDTO as any);

      // Act
      const result = await service.updateWithRelations(id, update);

      // Assert
      expect(mockAssembler.convertToUpdateEntity).toHaveBeenCalledWith(update);
      expect(mockQueryService.updateWithRelations).toHaveBeenCalledWith(
        id,
        updatedEntity,
        undefined
      );
      expect(mockAssembler.convertAsyncToDTO).toHaveBeenCalledWith(updatedEntity);
      expect(result).toEqual(expectedDTO);
    });
  });

  describe('Edge cases', () => {
    it('should handle updating with a filter as ID', async () => {
      // Arrange
      const filter: MockFilter = { someProperty: 'value' };
      const update = { someField: 'newValue' };
      const updatedEntity = { id: 1, someField: 'newValue' };
      const expectedDTO = { id: 1, someField: 'newValue' };

      mockAssembler.convertToUpdateEntity.mockResolvedValue(updatedEntity as any);
      mockQueryService.updateWithRelations.mockResolvedValue(updatedEntity as any);
      mockAssembler.convertAsyncToDTO.mockResolvedValue(expectedDTO as any);

      // Act
      const result = await service.updateWithRelations(filter as any, update);

      // Assert
      expect(mockAssembler.convertToUpdateEntity).toHaveBeenCalledWith(update);
      expect(mockQueryService.updateWithRelations).toHaveBeenCalledWith(
        filter as any,
        updatedEntity,
        undefined
      );
      expect(mockAssembler.convertAsyncToDTO).toHaveBeenCalledWith(updatedEntity);
      expect(result).toEqual(expectedDTO);
    });

    it('should handle errors during update', async () => {
      // Arrange
      const id = 1;
      const update = { someField: 'newValue' };
      const error = new Error('Update failed');

      mockAssembler.convertToUpdateEntity.mockRejectedValue(error as never);

      // Act & Assert
      await expect(service.updateWithRelations(id, update)).rejects.toThrow('Update failed');
      expect(mockAssembler.convertToUpdateEntity).toHaveBeenCalledWith(update);
    });
  });
});

// End of unit tests for: updateWithRelations
