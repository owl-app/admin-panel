import { Module } from '@nestjs/common'

import { UserAccessModule } from '@owl-app/lib-api-module-user-access/user-access.module'
import { CompanyModule } from '@owl-app/lib-api-module-company/company.module'
import { ClientModule } from '@owl-app/lib-api-module-client/client.module'
import { RequestContextModule } from "@owl-app/request-context-nestjs"
import { RbacModule } from '@owl-app/lib-api-module-rbac/rbac.module'

@Module({
  imports: [
    UserAccessModule,
    CompanyModule,
    ClientModule,
    RbacModule,
    RequestContextModule,
  ],
  exports: [
    // RbacModule
  ]
})
export class AppModule {}
