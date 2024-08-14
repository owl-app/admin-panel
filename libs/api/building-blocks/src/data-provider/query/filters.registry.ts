import { RegistryServiceModule } from "@owl-app/registry-nestjs";
import { Filter as FilterQueryService } from "@owl-app/crud-core";

import { DATA_PROVIDER_FILTER_REGISTRY } from "../contants";
import { Filter } from "../filtering/filter";

import { StringFilter } from "./filters/string";

export default RegistryServiceModule.forFeature<Filter<FilterQueryService<unknown>>>({
  name: DATA_PROVIDER_FILTER_REGISTRY,
  services: {
    string: StringFilter
  }
})
