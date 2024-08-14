import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";

import { Filter as FilterQueryService } from "@owl-app/crud-core";

import { Filter } from "../../filtering/filter";
import { isEmpty } from "@owl-app/utils";

export interface FilterStringQuery {
    type?: string;
    value?: string;
}

export class FilterStringApiProperty implements FilterStringQuery {
    @ApiPropertyOptional({ name: `type`, type: () => String })
    @IsOptional()
    @Transform((params: TransformFnParams) => params.value ? params.value.trim() : null)
    type?: string;

    @ApiPropertyOptional({name: `value`, type: () => String })
    @IsOptional()
    @Transform((params: TransformFnParams) => params.value ? params.value.trim() : null)
    value?: string;
}

export type StringFilterData = {
    type: string;
    value: string;
}

export class StringFilter<Entity> implements Filter<FilterQueryService<Entity>> {

    apply<StringFilterData>(fields: string[], data: StringFilterData): FilterQueryService<Entity> {
        const filters: FilterQueryService<Entity> = {};

        if(isEmpty(data)) return {};
    
        fields.map((field) => {
            filters[field as keyof Entity] = { like: `%${data}%` } as FilterQueryService<Entity>[keyof Entity];
        })
    
        return filters;
    }

}