import { App, shallowRef, watch } from 'vue';

import { i18n } from './lang/index';
import { registerViews } from './registers/views';
import { registerModules } from './registers/module';
import { translate } from './lang/translate-object-values';
import { registerComponents } from './registers/components';
import { registerDirectives } from './registers/directives';
import { getCoreLayouts, getCoreModules } from './config';
import { registerLayouts } from './registers/layouts';
import { router } from './router';
import { useAppRegistry, useAppLifecycleEventRegistry } from './registry';
import { registerEvents } from './registers/events';
import { defineRequestModuleEvent } from './lifecycle/initialize-modules-event';
import { ApplicationConfig } from './types/config';


export default async function bootstrap(app: App, config: ApplicationConfig) {
	const layouts = getCoreLayouts();
	const modules = getCoreModules();
  const appRegistry = useAppRegistry();
  const appLifecycleEventRegistry = useAppLifecycleEventRegistry()

	registerDirectives(app);
	registerComponents(app);
	registerViews(app);
  registerEvents(app);

  const registeredModules = registerModules(config.modules);

  appRegistry.set('layouts', shallowRef(registerLayouts(layouts, app)));

  appLifecycleEventRegistry.request.push(...defineRequestModuleEvent(registeredModules, modules))

  watch(
    [i18n.global.locale, registeredModules],
    () => {
      appRegistry.set('modules', shallowRef(translate(registeredModules.value)))
    },
    { immediate: true }
  );

  	// Add router after loading application to ensure all routes are registered
	app.use(router);
}