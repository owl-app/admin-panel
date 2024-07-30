import { App } from 'vue';

import { useAppLifecycleEventRegistry } from '../registry';
import InitializeStoresEvent from '../lifecycle/initialize-stores-event';
import initializeLangEvent from '../lifecycle/initialize-lang-event';
import RedirectEvent from '../lifecycle/redirect-event';
import { ApplicationLifecycleEvents } from '../types/lifecycle';

export function registerEvents(
  app: App,
  customEvents: ApplicationLifecycleEvents
): void {
  const appLifecycleRegistry = useAppLifecycleEventRegistry();

  appLifecycleRegistry.request.push(InitializeStoresEvent);
  appLifecycleRegistry.request.push(initializeLangEvent);
  appLifecycleRegistry.request.push(RedirectEvent);

  appLifecycleRegistry.request.push(...customEvents.request);
}
