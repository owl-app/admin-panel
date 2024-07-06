import { Provider } from '@nestjs/common';
import { DataSource, DataSourceOptions, getMetadataArgsStorage } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';

import { Registry } from '@owl-app/registry';

import { TenantRepository } from './tenant.repository';
import { TenantTypeOrmEntitesOpts } from './types';
import { getTenantRepositoryToken } from './common/tenant-typeorm.utils';
import { FILTER_REGISTRY_TENANT } from './constants';
import { TenantFilter } from './filters/tenant-filter';

export function createTypeOrmProviders(
  entities?: TenantTypeOrmEntitesOpts[],
  dataSource?: DataSource | DataSourceOptions | string,
): Provider[] {
  return (entities || []).map(({entity, repository = null}) => ({
    provide: getTenantRepositoryToken(entity, dataSource),
    useFactory: (dataSource: DataSource, filterRegistry: Registry<TenantFilter>) => {
      const entityMetadata = dataSource.entityMetadatas.find((meta) => meta.target === entity)
      const isTreeEntity = typeof entityMetadata?.treeType !== 'undefined'

      const baseRepo = isTreeEntity 
        ? dataSource.getTreeRepository(entity)
        : dataSource.options.type === 'mongodb'
          ? dataSource.getMongoRepository(entity)
          : dataSource.getRepository(entity)

      return repository 
        ? new repository(baseRepo.target, baseRepo.manager, baseRepo.queryRunner, filterRegistry) 
        : new TenantRepository(baseRepo.target, baseRepo.manager, baseRepo.queryRunner, filterRegistry)
    },
    inject: [getDataSourceToken(dataSource), FILTER_REGISTRY_TENANT],
    /**
     * Extra property to workaround dynamic modules serialisation issue
     * that occurs when "TypeOrm#forFeature()" method is called with the same number
     * of arguments and all entities share the same class names.
     */
    targetEntitySchema: getMetadataArgsStorage().tables.find(
      (item) => item.target === entity,
    ),
  }));
}
