import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";

import { TenantRepository } from "./tenant-repository";

export const injectableRepositoryFactory = <
  Entity,
>(
  entityShhemaOrClass: EntityClassOrSchema,
): typeof TenantRepository<Entity> => {

  @Injectable()
  class InjectableTenantRepository extends TenantRepository<Entity> {
    constructor(
      @InjectRepository(entityShhemaOrClass)
      repo: Repository<Entity>
    ) {
      super(repo);
    }
  }

  return InjectableTenantRepository;
};