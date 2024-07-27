import { createApp } from 'vue';
import i18n from './i18n';
import { createVuestic } from 'vuestic-ui';

import stores from './stores';
import router from './router';
import vuesticGlobalConfig from './services/vuestic-ui/global-config';
import App from './App.vue';
import bootstrap from '@owl-app/lib-app-core/application/bootstrap';

initApp();

async function initApp() {
	console.info(
		`Init application`,
	);

	console.info(`%c Starting...`, 'color:Green');

	console.time('🕓 Application Loaded');

  const app = createApp(App);

  app.use(stores);
  app.use(router);
  app.use(i18n);
  app.use(createVuestic({ config: vuesticGlobalConfig }));

  bootstrap(app);
  
  app.mount('#app');

  console.timeEnd('🕓 Application Loaded');

  console.info(`%cEnvironment: ${import.meta.env.MODE}`, 'color:DodgerBlue');
}


