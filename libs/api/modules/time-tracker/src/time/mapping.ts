import { TypeMapper } from 'ts-mapper'

import { TimeEntity } from '../domain/entity/time.entity';
import { TimeResponse } from './dto/time.response';


export class MapperTime extends TypeMapper {
  constructor() {
    super();
    this.config();
  }

  private config(): void {
    this.createMap<TimeEntity, TimeResponse>()
      .map(
        (src) => src.id,
        (dest) => dest.id
      )
      .map(
        (src) => src.description,
        (dest) => dest.description
      )
      .map(
        (src) => src.timeIntervalStart,
        (dest) => dest.timeIntervalStart
      )
  }
}

const mapperTime = new MapperTime();

export { mapperTime };
