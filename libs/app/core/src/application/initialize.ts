import { getCurrentLanguage } from './lang/get-current-language';
import { setLanguage } from './lang/set-language';
import { useUserStore } from '../stores/user';
import { useAppStore } from '../stores/app';
import { useAppLifecycleRegistry } from './registry';

type GenericStore = {
	$id: string;
	hydrate?: () => Promise<void>;
	dehydrate?: () => Promise<void>;

	[key: string]: any;
};

export function useStores(
	stores = [
		useUserStore,
	],
): GenericStore[] {
	return stores.map((useStore) => useStore()) as GenericStore[];
}

export async function initialize(): Promise<void> {
	const stores = useStores();
	const appStore = useAppStore();
	const userStore = useUserStore();
    const appLifecycleRegistry = useAppLifecycleRegistry()
	// const permissionsStore = usePermissionsStore();
	// const fieldsStore = useFieldsStore();

	if (appStore.initialized) return;
	if (appStore.initializing) return;

	appStore.initializing = true;

	try {
		/**
		 * @NOTE
		 * Multiple stores rely on the userStore to be set, so they can fetch user specific data. The
		 * following makes sure that the user store is always fetched first, before we hydrate anything
		 * else.
		 */
		await userStore.hydrate();

		const lang = getCurrentLanguage();
		const currentUser = userStore.currentUser;

		if (currentUser?.role) {
			// await Promise.all([permissionsStore.hydrate(), fieldsStore.hydrate({ skipTranslation: true })]);

			const hydratedStores = ['userStore'];
			await Promise.all(stores.filter(({ $id }) => !hydratedStores.includes($id)).map((store) => store.initialize?.()));

			await Promise.all(appLifecycleRegistry.initialize);
		}

		await setLanguage(lang);

	} catch (error: any) {
		appStore.error = error;
	} finally {
		appStore.initializing = false;
	}

	appStore.initialized = true;
}

export async function deinitialize(stores = useStores()): Promise<void> {
	const appStore = useAppStore();
    const appLifecycleRegistry = useAppLifecycleRegistry()

	if (appStore.initialized === false) return;

	for (const store of stores) {
		await store.dehydrate?.();
	}

	await Promise.all(appLifecycleRegistry.destroy);

	appStore.initialized = false;
}
