import { ApplicationRegistry, ApplicationLifecycleRegistry } from "./types/registry";
import { Ref } from 'vue';

export type RefRecord<T> = { [k in keyof T]: Ref<T[k]> };

const appRegistry: ApplicationRegistry = new Map();
const appLifecycleRegistry: ApplicationLifecycleRegistry = {
    initialize: [],
    destroy: []
};

export function useAppRegistry(): ApplicationRegistry{
 return appRegistry;
}

export function useAppLifecycleRegistry(): ApplicationLifecycleRegistry { 
  return appLifecycleRegistry;
}