import { shallowRef } from 'vue';

import type { ApplicationConfig } from './types/config';
import { ModuleConfig } from './types/module';
import { LayoutConfig } from './types/layout';

const config: ApplicationConfig = {
  layouts: shallowRef([]),
  modules: shallowRef([]),
  onInitializeCallbacks: [],
  onDestroyCallbacks: []
}

export function getCoreModules(): ModuleConfig[] {
	const modules = import.meta.glob<ModuleConfig>('./index.ts', { import: 'default', eager: true });
  modules['test'] = { 
    id: 'test',
    name: 'test',
    icon: 'test',
  }
  console.log(modules)
	return Object.values(modules);
}

export function getCoreLayouts(): LayoutConfig[] {
	const layouts = import.meta.glob<LayoutConfig>('./index.ts', { import: 'default', eager: true });

	return Object.values(layouts);
}

export function createConfig(
  modules: ModuleConfig[],
  layouts: LayoutConfig[],
  onInitializeCallbacks: () => Promise<void>,
  onDestroyCallbacks: () => Promise<void>,
): void {
  config.modules.value = modules;
  config.layouts.value = layouts;
  config.onInitializeCallbacks.push(onInitializeCallbacks);
  config.onDestroyCallbacks.push(onDestroyCallbacks);
}

export function useApplicationConfig() {
  return config;
}
