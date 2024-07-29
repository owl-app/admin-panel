import { ApplicationRegistry, ApplicationLifecycleRegistry } from "./types/registry";
import { Ref } from 'vue';

export type RefRecord<T> = { [k in keyof T]: Ref<T[k]> };

const appRegistry: ApplicationRegistry = new Map();
const appLifecycleEventRegistry: ApplicationLifecycleRegistry = {
    request: [],
};

export function useAppRegistry(): ApplicationRegistry{
 return appRegistry;
}

export function useAppLifecycleEventRegistry(): ApplicationLifecycleRegistry { 
  return appLifecycleEventRegistry;
}