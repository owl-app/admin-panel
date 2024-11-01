import {
  Controller,
  HttpStatus,
  Body,
  Param,
  HttpCode,
  Injectable,
  Patch,
} from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiAcceptedResponse, ApiBearerAuth } from '@nestjs/swagger'

import { AvalilableCollections, CommonActions, archiveValidationSchema } from '@owl-app/lib-contracts'

import { ArchiveRequest, Archive } from '@owl-app/lib-api-core/command/archive.command'

import { UUIDValidationPipe } from '@owl-app/lib-api-core/pipes/uuid-validation.pipe'
import { RoutePermissions } from '@owl-app/lib-api-core/rbac/decorators/route-permission';
import { ValibotValidationPipe } from '@owl-app/lib-api-core/validation/valibot.pipe';

import { ClientResponse } from '../../../dto/client.response'

@ApiTags('Client')
@Controller('clients')
@ApiBearerAuth()
@Injectable()
export class ArchiveControllerController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Archive client' })
    @ApiAcceptedResponse({
      description: 'Client has been successfully archived.',
      type: ClientResponse,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Client not found'
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong'
    })
    @HttpCode(HttpStatus.ACCEPTED)
  @Patch('archive/:id')
  @RoutePermissions(AvalilableCollections.CLIENT, CommonActions.ARCHIVE)
  async archive(
    @Param('id', UUIDValidationPipe) id: string,
    @Body(new ValibotValidationPipe(archiveValidationSchema)) archiveClientRequest: ArchiveRequest,
  ): Promise<void> {
    await this.commandBus.execute(new Archive({ id, archived: archiveClientRequest.archived }));
  }
}
