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

  console.log(modules);
  console.log('updated modules');

  const onInitializeModules = async () => {

    console.log(modules);
    console.log('updated modules');

    registeredModules.value = (
      await Promise.all(
        modules.map(async (module) => {
          if (!module.preRegisterCheck) return module;

          const allowed = await module.preRegisterCheck();

          if (allowed) return module;

          return null;
        })
      )
    ).filter((module): module is ModuleConfig => module !== null);

    for (const module of registeredModules.value) {
      router.addRoute({
        name: module.id,
        path: `/${module.id}`,
        component: RouterPass,
        children: module.routes,
      });
    }
  };

  const onDestroyModules = async () => {
    for (const module of modules) {
      router.removeRoute(module.id);
    }

    registeredModules.value = [];
  };

  return { registeredModules, onInitializeModules, onDestroyModules };
}
