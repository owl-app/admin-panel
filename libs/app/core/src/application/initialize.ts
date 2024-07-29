import { getCurrentLanguage } from './lang/get-current-language';
import { setLanguage } from './lang/set-language';
import { useUserStore } from '../stores/user';
import { useAppStore } from '../stores/app';
import { useAppLifecycleRegistry } from './registry';

type GenericStore = {
	$id: string;
	isPublic?: boolean;
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

export const initialize: Record<'public' | 'private', () => Promise<void>> = {
	async public (): Promise<void> {
		const stores = useStores();
		const appStore = useAppStore();
		const appLifecycleRegistry = useAppLifecycleRegistry()

		if (appStore.initialized.public) return;
		if (appStore.initializing.public) return;

		appStore.initializing.public = true;

		try {

			const hydratedStores: string[]= [];

			await Promise.all(stores
				.filter(({ $id, isPublic = false }) => isPublic && !hydratedStores.includes($id))
				.map((store) => store.initialize?.()));

			await Promise.all(appLifecycleRegistry.initialize.public.map((initializeCallback) => initializeCallback()));

			console.log('konieccc')

		} catch (error: any) {
			appStore.error = error;
		} finally {
			appStore.initializing.public = false;
		}

		appStore.initialized.public = true;
	},
	async private (): Promise<void> {
		const stores = useStores();
		const appStore = useAppStore();
		const userStore = useUserStore();
		const appLifecycleRegistry = useAppLifecycleRegistry()
		// const permissionsStore = usePermissionsStore();
		// const fieldsStore = useFieldsStore();

		if (appStore.initialized.private) return;
		if (appStore.initializing.private) return;

		appStore.initializing.private = true;

		try {
			/**
			 * @NOTE
			 * Multiple stores rely on the userStore to be set, so they can fetch user specific data. The
			 * following makes sure that the user store is always fetched first, before we hydrate anything
			 * else.
			 */
			await userStore.initialize();

			const lang = getCurrentLanguage();
			const currentUser = userStore.currentUser;

			if (currentUser?.role) {
				// await Promise.all([permissionsStore.hydrate(), fieldsStore.hydrate({ skipTranslation: true })]);

				const hydratedStores = ['userStore'];
				await Promise.all(stores.filter(({ $id }) => !hydratedStores.includes($id)).map((store) => store.initialize?.()));

				await Promise.all(appLifecycleRegistry.initialize.private.map((initializeCallback) => initializeCallback()));
			}

			await setLanguage(lang);

		} catch (error: any) {
			appStore.error = error;
		} finally {
			appStore.initializing.private = false;
		}

		appStore.initialized.private = true;
	}
	
}

export async function deinitialize(stores = useStores()): Promise<void> {
	const appStore = useAppStore();
    const appLifecycleRegistry = useAppLifecycleRegistry()

	if (appStore.hydrated === false) return;

	for (const store of stores) {
		await store.dehydrate?.();
	}

	await Promise.all(appLifecycleRegistry.destroy.map((destroyCallback) => destroyCallback()));

	appStore.hydrated = false;
}
