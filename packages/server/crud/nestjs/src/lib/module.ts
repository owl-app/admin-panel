import { DynamicModule } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import type { DataSource } from 'typeorm'
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type'

import { createTypeOrmQueryServiceProviders } from './providers'

export class NestjsQueryTypeOrmModule {
  static forFeature(entities: EntityClassOrSchema[], connection?: DataSource | string): DynamicModule {
    const queryServiceProviders = createTypeOrmQueryServiceProviders(entities, connection)
    const typeOrmModule = TypeOrmModule.forFeature(entities, connection)

    return {
      imports: [typeOrmModule],
      module: NestjsQueryTypeOrmModule,
      providers: [...queryServiceProviders],
      exports: [...queryServiceProviders, typeOrmModule]
    }
  }
}
