import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AvalilableCollections, TimeActions } from '@owl-app/lib-contracts';

import { ApiErrorValidationResponse } from '@owl-app/lib-api-core/api/api-error-validation.response';
import { RoutePermissions } from '@owl-app/lib-api-core/rbac/decorators/route-permission';
import { ApiErrorResponse } from '@owl-app/lib-api-core/api/api-error.response';

import { TimeResponse } from '../../../dto/time.response';
import { WatchRequest } from './dto/watch.request';
import { Watch } from './watch.service';
import { ContinueWatch } from './continue-watch.service';
import { Stop } from './stop.service';


@ApiTags('Time Tracker Manage')
@Controller('times')
@ApiBearerAuth()
@ApiResponse({ status: 500, description: 'Internal error' })
export class StopWathController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Start watching' })
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

  @ApiOperation({ summary: 'Continue watching' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Time continue watching',
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

  @ApiOperation({ summary: 'Stop watching' })
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: WatchRequest })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Time stopped watching',
    type: TimeResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation errors.',
    type: ApiErrorValidationResponse,
  })
  @Put('/stopwatch')
  @RoutePermissions(AvalilableCollections.TIME, TimeActions.STOP_WATCH)
  async stop(
    @Body() stop: WatchRequest,
  ): Promise<TimeResponse> {
    const result = await this.commandBus.execute<TimeResponse>(new Stop(stop));

    return result;
  }
}
