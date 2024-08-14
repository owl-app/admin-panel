import { Registry } from "@owl-app/registry";
import { Filter as FilterQueryService } from '@owl-app/crud-core';

import { FilterBuilder } from "../filter.builder";
import { Filter } from "../filtering/filter";
import { SelectQueryBuilder } from "typeorm";

export abstract class QueryFilterBuilder<Entity, FilterData> implements FilterBuilder<FilterQueryService<Entity>, FilterData> {

  constructor(readonly filterRegistry: Registry<Filter<FilterQueryService<Entity>>>) {}

  abstract build(filters: FilterData): FilterQueryService<Entity>;

  buildCustom?(filters: FilterData, qb: SelectQueryBuilder<Entity>): void;
}