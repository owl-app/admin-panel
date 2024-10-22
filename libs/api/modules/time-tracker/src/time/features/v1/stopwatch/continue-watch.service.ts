import { IsNull } from 'typeorm';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { InjectRepository } from '@owl-app/lib-api-core/typeorm/common/typeorm.decorators';
import { InjectableRepository } from '@owl-app/lib-api-core/database/repository/injectable.repository';

import { TimeResponse } from '../../../dto/time.response';
import { TimeEntity } from '../../../../domain/entity/time.entity';
import { mapperTime } from '../../../mapping';

export class ContinueWatch {

  id: string;

  constructor(request: Partial<ContinueWatch> = {}) {
    Object.assign(this, request);
  }
}

@CommandHandler(ContinueWatch)
export class ContinueWatchHandler implements ICommandHandler<ContinueWatch> {
  constructor(
    @InjectRepository(TimeEntity)
    private readonly timeRepository: InjectableRepository<TimeEntity>
  ) { }

  async execute(command: ContinueWatch): Promise<TimeResponse> {
    const createTime = await this.timeRepository.transaction(async () => {
      const existingTime = await this.timeRepository.findOne({
        where: { 
          timeIntervalEnd: IsNull()
        }
      });

      if (existingTime) {
        existingTime.timeIntervalEnd = new Date();
        await this.timeRepository.save(existingTime);
      }

      const copyTime = await this.timeRepository.findOne( { where: { id: command.id }, relations: ['tags'] });

      const newTime = new TimeEntity();
      newTime.description = copyTime.description;
      newTime.timeIntervalStart = new Date();
      newTime.tags = copyTime.tags;
  
      const createdTime = await this.timeRepository.save(newTime);
  
      return createdTime;
    })

    return mapperTime.map<TimeEntity, TimeResponse>(createTime, new TimeResponse());
  }
}
