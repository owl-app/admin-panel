import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Tag } from '@owl-app/lib-contracts';
import { InjectAssemblerQueryService } from '@owl-app/nestjs-query-core';

import { InjectRepository } from '@owl-app/lib-api-core/typeorm/common/typeorm.decorators';
import { InjectableRepository } from '@owl-app/lib-api-core/database/repository/injectable.repository'
import { AppAssemblerQueryService } from '@owl-app/lib-api-core/query/core/services/app-assembler-query.service';

import { TimeResponse } from '../../../dto/time.response';
import { TimeEntity } from '../../../../domain/entity/time.entity';
import { TimeAssembler } from '../../../assembler/time.assembler';

export class Stop {

  description: string;

  tags: Tag[]

  constructor(request: Partial<Stop> = {}) {
    Object.assign(this, request);
  }
}

@CommandHandler(Stop)
export class StopHandler implements ICommandHandler<Stop> {
  constructor(
    @InjectAssemblerQueryService(TimeAssembler)
    readonly queryService: AppAssemblerQueryService<TimeResponse, TimeEntity>,
  ) { }

  async execute(command: Stop): Promise<TimeResponse> {
    const existingTime = await this.queryService.query({
      filter: { timeIntervalEnd: { is: null } }
    });

    if (!existingTime) {
      throw new NotFoundException('Timer is not running');
    }

    const time = existingTime.shift();

    const updatedTime = await this.queryService.updateWithRelations(
      time.id,
      {...command, ... { timeIntervalEnd: (new Date()).toISOString() }},
      {
        tags: command.tags.map((tag) => tag.id),
      }
    );

    return updatedTime;
  }
}
