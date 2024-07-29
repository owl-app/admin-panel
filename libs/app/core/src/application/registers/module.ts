import { router } from '../router';
import RouterPass from '../../router/passthrough';
import type { ModuleConfig } from '../types/module';
import { sortBy } from 'lodash';
import { shallowRef, type ShallowRef } from 'vue';

export function getInternalModules(): ModuleConfig[] {
  const modules = import.meta.glob<ModuleConfig>('./*/index.ts', {
    import: 'default',
    eager: true,
  });

  return sortBy(Object.values(modules), 'id');
}

export function registerModules(modules: ModuleConfig[]): {
  registeredModules: ShallowRef<ModuleConfig[]>;
  onInitializeModules: () => Promise<void>;
  onDestroyModules: () => Promise<void>;
} {
  const registeredModules = shallowRef<ModuleConfig[]>([]);

  for (const module of modules) {
    if(module.routes?.public ?? false) {
      router.addRoute({
        name: module.id,
        path: `/`,
        component: RouterPass,
        children: module.routes?.public,
      });

      registeredModules.value.push(module);
    }
  }

  const onInitializeModules = async () => {

    console.log(modules);
    console.log('updated modules');

    registeredModules.value = (
      await Promise.all(
        modules.map(async (module) => {
          const isRegistered = registeredModules.value.find(registered => registered.name === module.name);

          if (module.preRegisterCheck) {
            const allowed = await module.preRegisterCheck();

            if (allowed && !isRegistered) return module;
          }

          return !isRegistered;
        })
      )
    ).filter((module): module is ModuleConfig => module !== null);

    for (const module of registeredModules.value) {
      if(module.routes?.private ?? false) {
        router.addRoute({
          name: module.id,
          path: `/`,
          component: RouterPass,
          children: module.routes?.private,
        });
      }
    }
  };

  const onDestroyModules = async () => {
    registeredModules.value = []

    for (const module of modules) {
        if(module.routes?.private ?? false) {
          router.removeRoute(module.id);
        } else {
          registeredModules.value.push(module);
        }
    }
  };

  return { registeredModules, onInitializeModules, onDestroyModules };
}
