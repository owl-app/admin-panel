import { FindOptionsWhere, ObjectLiteral } from "typeorm";

import { cloneDeep, omit } from "lodash";

import { Archivable } from "@owl-app/lib-contracts";

import { convertToSnakeCase } from "@owl-app/utils";

import BaseEntity from "../../database/entity/base.entity";
import { DomainEvent } from "../../event/domain-event.base";
import { InjectableRepository } from "../../database/repository/injectable.repository";
import { NotFoundException } from "../../exceptions/exceptions";

import ArchiveRequest from "./archive.request";

export interface ArchiveService {
  execute(id: string, requestData: ArchiveRequest): Promise<void>;
}

export const ArchiveService = Symbol('ArchiveService');

export class DefaultArchiveService<Entity extends BaseEntity & Archivable> implements ArchiveService {
  constructor(
    private readonly repository: InjectableRepository<Entity>
  ) { }

  async execute(id: string, requestData: ArchiveRequest): Promise<void> {
    let entity = null;
    const where = { id } as FindOptionsWhere<ObjectLiteral>;

    try {
      entity = await this.repository.findOne({ where});
    } catch (error) {
      throw new NotFoundException('Entity is not found');
    }

    entity.archived = requestData.archived;

    const event = new DomainEvent({ eventName: `${convertToSnakeCase(entity.constructor.name)}_ARCHIVED`});

    Object.assign(event, cloneDeep(omit(entity, ['_domainEvents'])));
    entity.addEvent(event);

    await this.repository.save(entity);
  }
}