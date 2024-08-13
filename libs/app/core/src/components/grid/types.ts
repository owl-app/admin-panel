export type Item = Record<string, any>;

export type Query = {
	fields?: string[] | null;
	sort?: string[] | null;
	filter?: any | null;
	limit?: number | null;
	offset?: number | null;
	page?: number | null;
	search?: string | null;
	version?: string | null;
	versionRaw?: boolean | null;
	export?: 'json' | 'csv' | 'xml' | null;
	group?: string[] | null;
	deep?: NestedDeepQuery | null;
	alias?: Record<string, string> | null;
};

export type DeepQuery = {
	_fields?: string[] | null;
	_sort?: string[] | null;
	_filter?: any | null;
	_limit?: number | null;
	_offset?: number | null;
	_page?: number | null;
	_search?: string | null;
	_group?: string[] | null;
};

export type NestedDeepQuery = { [field: string]: DeepQuery | NestedDeepQuery };