import { FilterStringQuery } from "@owl-app/lib-api-core/data-provider/query/filters/string";

/**
 * Filter User DTO
 */
export class FilterTagDto {

    readonly search?: FilterStringQuery;

    readonly email?: string;

}