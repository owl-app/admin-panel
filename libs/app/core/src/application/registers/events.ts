import { App } from "vue";

import { useAppLifecycleEventRegistry } from "../registry";
import InitializeStoresEvent from "../lifecycle/initialize-stores-event";
import initializeLangEvent from "../lifecycle/initialize-lang-event";

export function registerEvents(app: App): void {
    const appLifecycleRegistry = useAppLifecycleEventRegistry()

    appLifecycleRegistry.request.push(InitializeStoresEvent)
    appLifecycleRegistry.request.push(initializeLangEvent)
}