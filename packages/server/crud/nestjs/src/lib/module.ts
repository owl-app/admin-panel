import { DynamicModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import type { DataSource} from 'typeorm'

import { createTypeOrmQueryServiceProvider } from './providers'
import type { NestjsQueryTypeOrmModuleEntitiesOpts } from './types'

export class NestjsQueryTypeOrmModule {
  static forFeature(entitiesOpts: NestjsQueryTypeOrmModuleEntitiesOpts[], connection?: DataSource | string): DynamicModule {
    const entities = entitiesOpts.map((opt) => opt.entity);
    const repositoriesProviders = entitiesOpts
      .filter((opt) => opt?.repository?.obj && opt?.repository?.injectInProviders)
      .map((opt) => opt.repository.obj);

    const queryServiceProviders = entitiesOpts.map((opt) =>
      createTypeOrmQueryServiceProvider(opt.entity, opt.repository, connection)
    );
    const typeOrmModule = TypeOrmModule.forFeature(entities, connection);

    return {
      imports: [typeOrmModule],
      module: NestjsQueryTypeOrmModule,
      providers: [...queryServiceProviders, ...repositoriesProviders],
      exports: [...queryServiceProviders, typeOrmModule]
    }
  }
}
