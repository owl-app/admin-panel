import { App, defineAsyncComponent } from 'vue';
import PublicView from '../../views/public/';

const PrivateView = defineAsyncComponent(() => import('../../views/private'));

export function registerViews(app: App): void {
	//app.component('PublicView', PublicView);
	//app.component('PrivateView', PrivateView);
}
