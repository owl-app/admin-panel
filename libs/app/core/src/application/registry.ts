import { ApplicationConfig, AppConfigType } from './types/config'
import { Ref } from 'vue';

export type RefRecord<T> = { [k in keyof T]: Ref<T[k]> };

const appRegistry = new Map<keyof ApplicationConfig, AppConfigType[]>();
const appLifecycleRegistry: Record<'initialize' | 'destroy', (() => Promise<void>)[]> = {
    initialize: [],
    destroy: []
};

export function useAppRegistry(): Map<keyof ApplicationConfig, AppConfigType[]> {
 return appRegistry;
}

export function useAppLifecycleRegistry(): Record<'initialize' | 'destroy', (() => Promise<void>)[]> { 
  return appLifecycleRegistry;
}