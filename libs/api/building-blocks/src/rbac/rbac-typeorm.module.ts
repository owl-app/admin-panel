import { DynamicModule, Type } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { IRuleInterface } from '@owl-app/rbac-manager'
import { rbacManagerFactoryProvider } from '@owl-app/rbac-storage-typerom';
import { RegistryServiceModule } from '@owl-app/registry-nestjs'

export interface RbacModuleOpts {
  rules?: Record<string, Type<IRuleInterface>>,
}

export class RbacTypeOrmModule {
  static forFeature(opts: RbacModuleOpts): DynamicModule {
    const { rules = {} } = opts;

    return {
      module: RbacTypeOrmModule,
      imports: [
        TypeOrmModule,
        ConfigModule,
        RegistryServiceModule.forFeature<IRuleInterface>({
          name: 'SERVICE_REGISTRY_RULES_NAME',
          services: rules
        })
      ],
      providers: [ rbacManagerFactoryProvider ],
      exports: [ rbacManagerFactoryProvider ],
    }
  }
}