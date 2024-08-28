import { FilterStringQuery } from "@owl-app/lib-api-bulding-blocks/data-provider/query/filters/string";

/**
 * Filter User DTO
 */
export class FilterClientDto {

    readonly search?: FilterStringQuery;

    readonly email?: string;

}
