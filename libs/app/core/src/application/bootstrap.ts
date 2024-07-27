import { App, watch } from 'vue';

import { i18n } from './lang/index';
import { registerViews } from './registers/views';
import { registerModules } from './registers/module';
import { translate } from './lang/translate-object-values';
import { registerComponents } from './registers/components';
import { registerDirectives } from './registers/directives';
import { createConfig, getCoreLayouts, getCoreModules } from './config';
import { registerLayouts } from './registers/layouts';
import { router } from './router';


export default async function bootstrap(app: App) {
	const layouts = getCoreLayouts();
	const modules = getCoreModules();

	registerDirectives(app);
	registerComponents(app);
	registerViews(app);

  const { registeredModules, onInitializeModules, onDestroyModules } = registerModules(modules);

  const registereLayouts = registerLayouts(layouts, app);

  watch(
    [i18n.global.locale, registeredModules],
    () => {
      createConfig(
        translate(registeredModules.value),
        registereLayouts,
        onInitializeModules,
        onDestroyModules
      );
    },
    { immediate: true }
  );

  	// Add router after loading of extensions to ensure all routes are registered
	app.use(router);
}
