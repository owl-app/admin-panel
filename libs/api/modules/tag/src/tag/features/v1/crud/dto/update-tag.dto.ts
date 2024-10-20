import { PartialType } from '@nestjs/swagger';
import { CreateTagRequest } from './create-tag.request';

export class UpdateTagDto extends PartialType(CreateTagRequest) {}
