import { DynamicModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { createTypeOrmQueryServiceProvider } from './providers'
import type { NestjsQueryCoreModuleOpts } from './types'

export class NestjsQueryTypeOrmModule {
  static forFeature(opts: NestjsQueryCoreModuleOpts): DynamicModule {
    const entities = opts.entities.map((opt) => opt.entity);
    const repositoriesProviders = opts.entities
      .filter((opt) => opt?.repository?.obj && opt?.repository?.injectInProviders)
      .map((opt) => opt.repository.obj);

    const queryServiceProviders = opts.entities.map((opt) =>
      createTypeOrmQueryServiceProvider(opt.entity, opt.repository, opts.connection)
    );
    const typeOrmModule = TypeOrmModule.forFeature(entities, opts.connection);

    return {
      imports: [typeOrmModule, ...opts.imports],
      module: NestjsQueryTypeOrmModule,
      providers: [...queryServiceProviders, ...repositoriesProviders],
      exports: [...queryServiceProviders, typeOrmModule]
    }
  }
}
