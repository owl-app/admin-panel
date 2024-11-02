import { DataSource, DataSourceOptions, getMetadataArgsStorage } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { Provider } from '@nestjs/common';

import { AppTypeOrmEntitesOpts } from './types';
import { getRepositoryToken } from './common/typeorm.utils';

export function createAppTypeOrmProviders(
  entities?: AppTypeOrmEntitesOpts[],
  dataSource?: DataSource | DataSourceOptions | string
): Provider[] {
  return (entities || []).map(
    ({ entity, repository = null, inject = null, repositoryToken = null }) => ({
      provide: repositoryToken ?? getRepositoryToken(entity, dataSource),
      useFactory: (dataSource: DataSource, ...injectArgs) => {
        const entityMetadata = dataSource.entityMetadatas.find(
          (meta) => meta.target === entity
        );
        const isTreeEntity = typeof entityMetadata?.treeType !== 'undefined';

        const baseRepo = isTreeEntity
          ? dataSource.getTreeRepository(entity)
          : dataSource.options.type === 'mongodb'
          ? dataSource.getMongoRepository(entity)
          : dataSource.getRepository(entity);

        if (repository !== null) {
          return new repository(
            baseRepo.target,
            baseRepo.manager,
            baseRepo.queryRunner,
            ...injectArgs
          );
        }

        return baseRepo;
      },
      inject: [getDataSourceToken(dataSource), ...(inject ?? [])],
      /**
       * Extra property to workaround dynamic modules serialisation issue
       * that occurs when "TypeOrm#forFeature()" method is called with the same number
       * of arguments and all entities share the same class names.
       */
      targetEntitySchema: getMetadataArgsStorage().tables.find(
        (item) => item.target === entity
      ),
    })
  );
}
