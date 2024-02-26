import { FactoryProvider } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { ConfigService } from '@nestjs/config'

import { IRuleInterface, Manager } from '@owl-app/rbac-manager'
import { IServiceRegistry } from '@owl-app/registry'

import { IRbacConfig, RBAC_CONFIG_NAME } from './config.interface'
import { ItemStorage } from './item-storage'
import { AssignmentsStorage } from './assigments-storage'

export const createItemStorageProvider: FactoryProvider = {
    provide: 'RBAC_ITEM_STORAGE',
    useFactory(dataSource: DataSource, configService: ConfigService) {
      const { itemTableName = 'rbac_item', itemChildrenTableName = null } = configService.get<IRbacConfig>(RBAC_CONFIG_NAME) ?? {};
      
      return new ItemStorage(dataSource, itemTableName, itemChildrenTableName);
    },
    inject: [DataSource, ConfigService]
}

export const createAssigmentsStorageProvider: FactoryProvider = {
  provide: 'RBAC_ASSIGMENTS_STORAGE',
  useFactory(dataSource: DataSource, configService: ConfigService) {
    const { assigmentsTable = 'rbac_assigments' } = configService.get<IRbacConfig>(RBAC_CONFIG_NAME) ?? {};
    
    return new AssignmentsStorage(dataSource, assigmentsTable)
  },
  inject: [DataSource, ConfigService]
}

export const rbacManagerFactoryProvider: FactoryProvider = {
  provide: 'RBAC_MANAGER',
  useFactory: (dataSource: DataSource, configService: ConfigService, serviceRegistryRules: IServiceRegistry<IRuleInterface>) => {
    const { itemTableName = 'rbac_item', itemChildrenTableName = null, assigmentsTable = 'rbac_assigment' } = configService.get<IRbacConfig>(RBAC_CONFIG_NAME) ?? {},
          itemStorage = new ItemStorage(dataSource, itemTableName, itemChildrenTableName),
          assigmentsStorage = new AssignmentsStorage(dataSource, assigmentsTable);

    return new Manager(itemStorage, assigmentsStorage, serviceRegistryRules);
  },
  inject: [DataSource, ConfigService, 'SERVICE_REGISTRY_RULES_NAME']
}
