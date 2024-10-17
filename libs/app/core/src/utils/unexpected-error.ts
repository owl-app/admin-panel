import type { RequestError } from '../services/api';
import { i18n } from '../application/lang';
import { useNotificationsStore } from '../stores/notifications';

let store: any;

export function unexpectedError(error: unknown): void {
	if (!store) store = useNotificationsStore();

	const code =
		(error as RequestError).response?.data?.errors?.[0]?.extensions?.code ||
		'UNKNOWN';

	// eslint-disable-next-line no-console
	console.warn(error);

	store.add({
		title: i18n.global.t(`errors.${code}`),
		type: 'error',
		code,
		dialog: true,
		error,
	});
}
