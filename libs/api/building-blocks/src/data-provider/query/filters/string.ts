import { Filter } from "../../filtering/filter";
import { Filter as FilterQueryService } from "@owl-app/crud-core";

export type StringFilterData = {
    type: string;
    value: string;
}

export class StringFilter<Entity> implements Filter<FilterQueryService<Entity>> {

    apply<StringFilterData>(fields: string[], data: StringFilterData): FilterQueryService<Entity> {
        const filters: FilterQueryService<Entity> = {};
    
        fields.map((field) => {
            filters[field as keyof Entity] = { like: `%${data}%` } as FilterQueryService<Entity>[keyof Entity];
        })
    
        return filters;
    }
  
}