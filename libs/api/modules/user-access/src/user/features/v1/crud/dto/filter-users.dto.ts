import { FilterStringQuery } from "@owl-app/lib-api-bulding-blocks/data-provider/query/filters/string";

export class FilterUserDto {
    readonly search?: FilterStringQuery;

    readonly email?: string;
}
