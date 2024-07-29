import { createApp } from 'vue';
import i18n from './i18n';
import { createVuestic } from 'vuestic-ui';

import bootstrap from '@owl-app/lib-app-core/application/bootstrap';
import { createApplicationConfig } from '@owl-app/lib-app-core/application/config'
import AuthModule from '@owl-app/lib-app-module-auth'

import App from './App.vue';
import stores from './stores';
import vuesticGlobalConfig from './services/vuestic-ui/global-config';

initApp();

async function initApp() {
	console.info(`%c Starting...`, 'color:Green');

	console.time('🕓 Application Loaded');

  const app = createApp(App);

  app.use(stores);
  // app.use(router);
  app.use(i18n);
  app.use(createVuestic({ config: vuesticGlobalConfig }));

  await bootstrap(app, createApplicationConfig([AuthModule]));
  
  app.mount('#app');

  console.timeEnd('🕓 Application Loaded');

  console.info(`%cEnvironment: ${import.meta.env.MODE}`, 'color:DodgerBlue');
}


