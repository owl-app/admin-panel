import { Ref } from 'vue';

import type { LayoutConfig } from './layout.js';
import type { ModuleConfig } from './module.js';
import { RequestEvent } from './lifecycle.js';

export type ApplicationRegistry = Map<'layouts' | 'modules', Ref<ModuleConfig[] | LayoutConfig[]>>

export interface ApplicationLifecycleRegistry {
    request: RequestEvent[],
}
