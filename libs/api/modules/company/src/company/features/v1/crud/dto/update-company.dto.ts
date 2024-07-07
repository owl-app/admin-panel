import { PartialType } from '@nestjs/swagger';
import { CreateCompanyRequest } from './create-company.request';

export class UpdateCompanyDto extends PartialType(CreateCompanyRequest) {}
