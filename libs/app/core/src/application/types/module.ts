import type { RouteRecordRaw } from 'vue-router';

export interface ModuleConfig {
	id: string;
	name: string;
	icon: string;

	routes?: Record<'private' | 'public', RouteRecordRaw[]>;
	hidden?: boolean;
	preRegisterCheck?: () => Promise<boolean> | boolean;
}
