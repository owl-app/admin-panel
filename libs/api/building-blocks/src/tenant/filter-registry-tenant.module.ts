import { Module } from '@nestjs/common';

import { RegistryServiceModule } from '@owl-app/registry-nestjs';

import { TenantFilter } from './filters/tenant-filter';
import { CompanyFilter } from './filters/company-filter';
import { FILTER_REGISTRY_TENANT } from '../constants';

@Module({
	imports: [
    RegistryServiceModule.forFeature<TenantFilter>({
      name: FILTER_REGISTRY_TENANT,
      services: {
        company: CompanyFilter
      }
    })
	],
	providers: [],
	exports: [
    RegistryServiceModule
	]
})
export class FilterRegistryTenantModule {}
