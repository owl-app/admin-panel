// import { RequestError } from '@/api';
import { createI18n, I18nOptions } from 'vue-i18n';
import * as availableLanguages from './available-languages.yaml';
import * as datetimeFormats from './date-formats.yaml';
import * as numberFormats from './number-formats.yaml';
import * as enUSBase from './translations/en-US.yaml';

export const i18n = createI18n({
	legacy: false,
	locale: 'en-US',
	fallbackLocale: 'en-US',
	messages: {
		'en-US': enUSBase,
	} as I18nOptions['messages'],
	silentTranslationWarn: true,
	// datetimeFormats,
	numberFormats,
});

export type Language = keyof typeof availableLanguages;

export const loadedLanguages: Language[] = ['en-US'];

export function translateAPIError(error: any | string): string {
	const defaultMsg = i18n.global.t('unexpected_error');

	let code = error;

	if (typeof error === 'object') {
		code = error?.response?.data?.errors?.[0]?.extensions?.code;
	}

	if (!error || !code) return defaultMsg;

	const key = `errors.${code}`;
	const exists = i18n.global.te(key);

	if (exists === false) return defaultMsg;

	return i18n.global.t(key);
}
