import { NotImplementedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IsNull } from 'typeorm';

import { InjectRepository } from '@owl-app/lib-api-core/typeorm/common/typeorm.decorators';
import { InjectableRepository } from '@owl-app/lib-api-core/database/repository/injectable.repository'

import { TimeResponse } from '../../../dto/time.response';
import { TimeEntity } from '../../../../domain/entity/time.entity';
import { mapperTime } from '../../../mapping';


export class Watch {

  description: string;

  constructor(request: Partial<Watch> = {}) {
    Object.assign(this, request);
  }
}

@CommandHandler(Watch)
export class WatchHandler implements ICommandHandler<Watch> {
  constructor(
    @InjectRepository(TimeEntity)
    private readonly timeRepository: InjectableRepository<TimeEntity>
  ) { }

  async execute(command: Watch): Promise<TimeResponse> {
    const existingTime = await this.timeRepository.findOne({
      where: { 
        timeIntervalEnd: IsNull()
      }
    });

    if (existingTime) {
      throw new NotImplementedException('Another timer is running');
    }

    const newTime = new TimeEntity();
    newTime.description = command.description;
    newTime.timeIntervalStart = new Date();

    const createTime = await this.timeRepository.save(newTime);

    return mapperTime.map<TimeEntity, TimeResponse>(createTime, new TimeResponse());
  }
}
