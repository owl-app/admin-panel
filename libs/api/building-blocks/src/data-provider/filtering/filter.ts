export interface Filter<FilterData>
{
    apply<QueryData>(fields: string[], data: QueryData): FilterData;
}
