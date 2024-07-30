import { ApplicationRegistry } from "./types/registry";
import { ApplicationLifecycleEvents } from "./types/lifecycle";
import { Ref } from 'vue';

export type RefRecord<T> = { [k in keyof T]: Ref<T[k]> };

const appRegistry: ApplicationRegistry = new Map();
const appLifecycleEventRegistry: ApplicationLifecycleEvents = {
    request: [],
};

export function useAppRegistry(): ApplicationRegistry{
 return appRegistry;
}

export function useAppLifecycleEventRegistry(): ApplicationLifecycleEvents { 
  return appLifecycleEventRegistry;
}