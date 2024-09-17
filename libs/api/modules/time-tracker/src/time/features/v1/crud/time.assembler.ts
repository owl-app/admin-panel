import { Assembler, ClassTransformerAssembler } from '@owl-app/crud-core'

import { TimeEntity } from '../../../../domain/entity/time.entity'

import { TimeResponse } from '../../../dto/time.response'

@Assembler(TimeResponse, TimeEntity)
export class TimeAssembler extends ClassTransformerAssembler<
  TimeResponse,
  TimeEntity
> {

}
