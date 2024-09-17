import { IsNull } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { InjectRepository } from '@owl-app/lib-api-core/typeorm/common/typeorm.decorators';
import { InjectableRepository } from '@owl-app/lib-api-core/database/repository/injectable.repository'

import { TimeResponse } from '../../../dto/time.response';
import { TimeEntity } from '../../../../domain/entity/time.entity';
import { mapperTime } from '../../../mapping';


export class Stop {

  description: string;

  constructor(request: Partial<Stop> = {}) {
    Object.assign(this, request);
  }
}

@CommandHandler(Stop)
export class StopHandler implements ICommandHandler<Stop> {
  constructor(
    @InjectRepository(TimeEntity)
    private readonly timeRepository: InjectableRepository<TimeEntity>
  ) { }

  async execute(command: Stop): Promise<TimeResponse> {
    const existingTime = await this.timeRepository.findOne({
      where: { 
        timeIntervalEnd: IsNull()
      }
    });

    if (!existingTime) {
      throw new NotFoundException('Timer is not running');
    }

    existingTime.description = command.description;
    existingTime.timeIntervalEnd = new Date();

    const stoppedTime = await this.timeRepository.save(existingTime);

    return mapperTime.map<TimeEntity, TimeResponse>(stoppedTime, new TimeResponse());
  }
}
