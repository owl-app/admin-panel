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

import { TagResponse } from '../../../dto/tag.response'

@ApiTags('Tag')
@Controller('tags')
@ApiBearerAuth()
@Injectable()
export class ArchiveControllerController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Archive tag' })
    @ApiAcceptedResponse({
      description: 'Tag has been successfully archived.',
      type: TagResponse,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Tag not found'
    })
    @ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Invalid input, The response body may contain clues as to what went wrong'
    })
    @HttpCode(HttpStatus.ACCEPTED)
  @Patch('archive/:id')
  @RoutePermissions(AvalilableCollections.TAG, CommonActions.ARCHIVE)
  async archive(
    @Param('id', UUIDValidationPipe) id: string,
    @Body(new ValibotValidationPipe(archiveValidationSchema)) archiveClientRequest: ArchiveRequest,
  ): Promise<void> {
    await this.commandBus.execute(new Archive({ id, archived: archiveClientRequest.archived }));
  }
}
