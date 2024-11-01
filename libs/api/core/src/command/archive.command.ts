import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';

import { convertToSnakeCase } from '@owl-app/utils';

import { InjectableRepository } from '../database/repository/injectable.repository';

import { Archivable } from '@owl-app/lib-contracts';

import { DomainEvent } from '../event/domain-event.base';
import { cloneDeep, omit } from 'lodash';
import BaseEntity from '../database/entity/base.entity';

export class ArchiveRequest implements Archivable {

  @ApiProperty({ required: false, default: false })
  archived?: boolean;

}

export class Archive {

  id: string;

  archived: boolean;

  constructor(request: Partial<Archive> = {}) {
    Object.assign(this, request);
  }
}

@CommandHandler(Archive)
export class ArchiveHandler<Entity extends BaseEntity & Archivable> implements ICommandHandler<Archive> {
  constructor(
    private readonly repository: InjectableRepository<Entity>
  ) { }

  async execute(command: Archive): Promise<void> {
    console.log('jedziemy CommandHandler')
    const entity = await this.repository.findOneById(command.id);

    if (!entity) {
      throw new NotFoundException('Entity is not found');
    }

    entity.archived = command.archived;

    const event = new DomainEvent({ eventName: `${convertToSnakeCase(entity.constructor.name)}_ARCHIVED`});

    Object.assign(event, cloneDeep(omit(entity, ['_domainEvents'])));
    entity.addEvent(event);

    await this.repository.save(entity);
  }
}
