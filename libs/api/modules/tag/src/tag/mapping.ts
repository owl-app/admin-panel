import { TypeMapper } from 'ts-mapper'

import { TagResponse } from './dto/tag.response'
import { TagEntity } from '../domain/entity/tag.entity';


export class MapperClient extends TypeMapper {
  constructor() {
    super();
    this.config();
  }

  private config(): void {
    this.createMap<TagEntity, TagResponse>()
      .map(
        (src) => src.id,
        (dest) => dest.id
      )
      .map(
        (src) => src.name,
        (dest) => dest.name
      )
  }
}

const mapperClient = new MapperClient();

export { mapperClient };
