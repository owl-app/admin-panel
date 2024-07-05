import { Repository } from "typeorm";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";

import { TenantRepository } from "./tenant.repository";
import { Registry } from "@owl-app/registry";
import { TenantFilter } from "./filters/tenant-filter";
import { FILTER_REGISTRY_TENANT } from "../constants";

export const injectableRepositoryFactory = <
  Entity,
>(
  entityShhemaOrClass: EntityClassOrSchema,
): typeof TenantRepository<Entity> => {

  @Injectable()
  class InjectableTenantRepository extends TenantRepository<Entity> {
    constructor(
      @InjectRepository(entityShhemaOrClass)
      repo: Repository<Entity>,
      @Inject(FILTER_REGISTRY_TENANT)
      filters: Registry<TenantFilter>,
    ) {
      super(repo, filters);
    }
  }

  return InjectableTenantRepository;
};