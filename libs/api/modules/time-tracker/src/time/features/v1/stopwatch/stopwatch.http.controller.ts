import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AvalilableCollections, TimeActions } from '@owl-app/lib-contracts';

import { ApiErrorValidationResponse } from '@owl-app/lib-api-bulding-blocks/api/api-error-validation.response';
import { RoutePermissions } from '@owl-app/lib-api-bulding-blocks/rbac/decorators/route-permission';
import { ApiErrorResponse } from '@owl-app/lib-api-bulding-blocks/api/api-error.response';

import { TimeResponse } from '../../../dto/time.response';
import { WatchRequest } from './dto/watch.request';
import { Watch } from './watch.service';
import { ContinueWatch } from './continue-watch.service';


@ApiTags('Time Tracker Manage')
@Controller('times')
@ApiBearerAuth()
@ApiResponse({ status: 500, description: 'Internal error' })
export class StopWathController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ description: 'stopwatch' })
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: WatchRequest })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Time started watching',
    type: TimeResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation errors.',
    type: ApiErrorValidationResponse,
  })
  @Post('/stopwatch')
  @RoutePermissions(AvalilableCollections.TIME, TimeActions.START_WATCH)
  async watch(
    @Body() watch: WatchRequest,
  ): Promise<TimeResponse> {
    const result = await this.commandBus.execute<TimeResponse>(new Watch(watch));

    return result;
  }

  @ApiOperation({ description: 'stopwatch' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Continue time watching',
    type: TimeResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation errors.',
    type: ApiErrorValidationResponse,
  })
  @Post('/stopwatch/:id')
  @RoutePermissions(AvalilableCollections.TIME, TimeActions.CONTINUE_WATCH)
  async countinueWatch(@Param('id') id: string): Promise<TimeResponse> {
    const result = await this.commandBus.execute<TimeResponse>(new ContinueWatch({ id }));

    return result;
  }
}
