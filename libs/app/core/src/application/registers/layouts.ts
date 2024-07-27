
import { App } from 'vue';

import { LayoutConfig } from '../types/layout';

export function getInternalLayouts(): LayoutConfig[] {
	const layouts = import.meta.glob<LayoutConfig>('./*/index.ts', { import: 'default', eager: true });

	return Object.values(layouts)
}

export function registerLayouts(layouts: LayoutConfig[], app: App): LayoutConfig[] {
	for (const layout of layouts) {
		app.component(`layout-${layout.id}`, layout.component);
		app.component(`layout-options-${layout.id}`, layout.slots.options);
		app.component(`layout-sidebar-${layout.id}`, layout.slots.sidebar);
		app.component(`layout-actions-${layout.id}`, layout.slots.actions);
	}

  return layouts;
}
