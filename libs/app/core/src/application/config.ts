import { ModuleConfig } from './types/module';
import { LayoutConfig } from './types/layout';
import { ApplicationLifecycleEvents } from './types/lifecycle';
import { ApplicationConfig } from './types/config';

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

export function createApplicationConfig(
  modules: ModuleConfig[],
  layouts: LayoutConfig[],
  events: ApplicationLifecycleEvents
): ApplicationConfig {
  return {
    modules,
    layouts,
    events
  }
}
