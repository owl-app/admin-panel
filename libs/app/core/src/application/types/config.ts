import type { LayoutConfig } from './layout.js';
import type { ModuleConfig } from './module.js';

export interface ApplicationConfig {
  /**
   * List of layouts that should be available in the application.
   */
	layouts: LayoutConfig[];
  /**
   * List of modules that should be available in the application.
   */
	modules: ModuleConfig[];

}
