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
import { useAppRegistry, useAppLifecycleRegistry } from './registry';
import AuthModule from '@owl-app/lib-app-module-auth'


export default async function bootstrap(app: App) {
	const layouts = getCoreLayouts();
	const modules = getCoreModules();
  const appRegistry = useAppRegistry();
  const appLifecycleRegistry = useAppLifecycleRegistry()

	registerDirectives(app);
	registerComponents(app);
	registerViews(app);

  const { registeredModules, onInitializeModules, onDestroyModules } = registerModules([AuthModule]);

  appRegistry.set('layouts', shallowRef(registerLayouts(layouts, app)));

  appLifecycleRegistry.initialize.push(onInitializeModules)
  appLifecycleRegistry.destroy.push(onDestroyModules)

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
