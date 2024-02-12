type PaginationConfigQuery = {
  default_limit: number;
};

export const QUERY_CONFIG_NAME = 'query';

export interface IConfigQuery {
  pagination: PaginationConfigQuery;
}
