import {
  FactoryProvider,
  InjectionToken,
  OptionalFactoryDependency,
  Type,
} from '@nestjs/common';
import { ServiceRegistry, IServiceRegistry} from "@owl-app/registry";

export function createServiceRegistryProvider<T>(
  nameService: string,
  services: Record<string, Type<T>> = {}
): FactoryProvider<IServiceRegistry<T>> {
  const servicesNames: Array<string> = [];
  const servicesInjections: Array<InjectionToken | OptionalFactoryDependency> = [];

  Object.keys(services).forEach((key) => {
    servicesNames.push(key);
    servicesInjections.push(services[key]);
  });

  return {
    provide: nameService,
    useFactory(...rules: Array<T>): IServiceRegistry<T> {
      const serviceRegistry = new ServiceRegistry<T>('rbac_rules');

      rules.forEach((service, index) => {
        serviceRegistry.register(servicesNames[index], service);
    });

      return serviceRegistry;
    },
    inject: servicesInjections,
  };
}
