import { Assembler, ClassTransformerAssembler } from '@owl-app/crud-core'

import { TimeEntity } from '../../../../domain/entity/time.entity'

import { ClientResponse } from '../../../dto/client.response'

@Assembler(ClientResponse, TimeEntity)
export class TimeAssembler extends ClassTransformerAssembler<
  ClientResponse,
  TimeEntity
> {

}
