import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

import { LIFECYCLE_EVENTS } from '../contants';
import { defineRequestEvent } from '../defines/events';
import { useAppStore } from '../../stores/app';
import { useUserStore } from '../../stores/user';

type GenericStore = {
  $id: string;
  hydrate?: () => Promise<void>;
  dehydrate?: () => Promise<void>;

  [key: string]: any;
};

export function useStores(stores = [useUserStore]): GenericStore[] {
  return stores.map((useStore) => useStore()) as GenericStore[];
}

export default defineRequestEvent({
  name: 'initialize-stores',
  priority: 500,
  event: LIFECYCLE_EVENTS.REQUEST.ON_BEFORE_EACH,
  callback: async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ): Promise<void> => {
    console.log('run initialize stores', to);

    const stores = useStores();
    const appStore = useAppStore();
    const userStore = useUserStore();

    if (
      to.meta?.public !== true ||
      appStore.initialized ||
      appStore.initializing ||
      !appStore.authenticated
    )
      return;

    appStore.initializing = true;

    try {
      await userStore.hydrate();

      const currentUser = userStore.currentUser;

      if (currentUser?.role) {
        // await Promise.all([permissionsStore.hydrate(), fieldsStore.hydrate({ skipTranslation: true })]);

        const hydratedStores = ['userStore'];
        await Promise.all(
          stores
            .filter(({ $id }) => !hydratedStores.includes($id))
            .map((store) => store.initialize?.())
        );
      }

      console.log('initializizng 1', appStore.initializing);
    } catch (error: any) {
      console.log('error', error);
      appStore.error = error;
      // appStore.initializing = false;
    }
  },
});
