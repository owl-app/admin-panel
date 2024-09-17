import { IsNull } from 'typeorm';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AvalilableCollections, TimeActions } from '@owl-app/lib-contracts';

import { RoutePermissions } from '@owl-app/lib-api-core/rbac/decorators/route-permission';
import { InjectableRepository } from '@owl-app/lib-api-core/database/repository/injectable.repository';
import { InjectRepository } from '@owl-app/lib-api-core/typeorm/common/typeorm.decorators';

import { TimeResponse } from '../../../dto/time.response';
import { TimeEntity } from '../../../../domain/entity/time.entity';
import { mapperTime } from '../../../mapping';

@ApiTags('Time Tracker Manage')
@Controller('times')
@ApiBearerAuth()
@ApiResponse({ status: 500, description: 'Internal error' })
export class InProgressController {
  constructor(
    @InjectRepository(TimeEntity)
    private readonly timeRepository: InjectableRepository<TimeEntity>
  ) { }

  @ApiOperation({ description: 'In progress' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Time started watching',
    type: TimeResponse,
  })
  @Get('in-progress')
  @RoutePermissions(AvalilableCollections.TIME, TimeActions.IN_PROGRESS)
  async inProgress(): Promise<TimeResponse|null> {
    const time = await this.timeRepository.findOne({
      where: { 
        timeIntervalEnd: IsNull()
      }
    });

    if (time) {
      return mapperTime.map<TimeEntity, TimeResponse>(time, new TimeResponse());
    }

    return null;
  }
}
