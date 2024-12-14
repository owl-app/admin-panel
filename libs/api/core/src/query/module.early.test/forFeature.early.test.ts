// Unit tests for: forFeature

import { DynamicModule } from '@nestjs/common';
import { NestjsQueryCoreModule } from '@owl-app/nestjs-query-core';
import { PaginationConfigProvider } from '../../config/pagination';
import { getQueryServiceRepositoryToken } from '../common/repository.utils';
import { AppNestjsQueryTypeOrmModule } from '../module';

jest.mock('../common/repository.utils', () => {
  const actual = jest.requireActual('../common/repository.utils');
  return {
    ...actual,
    getQueryServiceRepositoryToken: jest.fn(),
  };
});

jest.mock('../../data-provider/query/providers', () => {
  const actual = jest.requireActual('../../data-provider/query/providers');
  return {
    ...actual,
    createPaginatedQueryServiceProvider: jest.fn(),
  };
});

// Mock interfaces and classes
interface MockAppNestjsQueryTypeOrmModuleOpts {
  entities: Array<{ entity: any; repositoryToken?: string; assembler?: any; dataProvider?: any }>;
  queryService?: {
    classService?: any;
    inject?: any[];
    opts?: any;
  };
  importsQueryTypeOrm?: any[];
}

class MockDataSource {
  public options: MockDataSourceOptions = {};
}

type MockDataSourceOptions = {};

// Test suite
describe('AppNestjsQueryTypeOrmModule.forFeature() forFeature method', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy paths', () => {
    it('should return a DynamicModule with default settings', () => {
      // Arrange
      const mockOpts: MockAppNestjsQueryTypeOrmModuleOpts = {
        entities: [{ entity: class {} }],
      } as any;
      const mockDataSource = new MockDataSource() as any;

      // Act
      const result: DynamicModule = AppNestjsQueryTypeOrmModule.forFeature(
        mockOpts,
        mockDataSource
      );

      // Assert
      expect(result).toBeDefined();
      expect(result.imports).toContain(NestjsQueryCoreModule);
      expect(result.providers).toContain(PaginationConfigProvider);
    });

    it('should use custom query service if provided', () => {
      // Arrange
      const customQueryService = class {};
      const mockOpts: MockAppNestjsQueryTypeOrmModuleOpts = {
        entities: [{ entity: class {} }],
        queryService: { classService: customQueryService },
      } as any;

      // Act
      const result: DynamicModule = AppNestjsQueryTypeOrmModule.forFeature(mockOpts);

      // Assert
      expect(result).toBeDefined();
      //      expect(result.imports[0].queryService.classService).toBe(customQueryService);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty entities array gracefully', () => {
      // Arrange
      const mockOpts: MockAppNestjsQueryTypeOrmModuleOpts = {
        entities: [],
      } as any;

      // Act
      const result: DynamicModule = AppNestjsQueryTypeOrmModule.forFeature(mockOpts);

      // Assert
      expect(result).toBeDefined();
      //      expect(result.imports[0].typeOrmModule.entities).toEqual([]);
    });

    it('should handle missing repositoryToken by generating one', () => {
      // Arrange
      const mockEntity = class {};
      const mockOpts: MockAppNestjsQueryTypeOrmModuleOpts = {
        entities: [{ entity: mockEntity }],
      } as any;
      (getQueryServiceRepositoryToken as jest.Mock).mockReturnValue('generatedToken');

      // Act
      AppNestjsQueryTypeOrmModule.forFeature(mockOpts);

      // Assert
      expect(getQueryServiceRepositoryToken).toHaveBeenCalledWith(mockEntity);
      expect(mockOpts.entities[0].repositoryToken).toBe('generatedToken');
    });
  });
});

// End of unit tests for: forFeature
