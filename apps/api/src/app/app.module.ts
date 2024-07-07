import { Module } from '@nestjs/common'

import { RbacModule } from '@owl-app/lib-api-module-rbac/rbac.module'
// import { rbacManagerFactoryProvider } from '@owl-app/rbac-storage-typeorm';
import { UserAccessModule } from '@owl-app/lib-api-module-user-access/user-access.module'

import { CompanyModule } from '@owl-app/lib-api-module-company/company.module'

import { RequestContextModule } from "@owl-app/request-context-nestjs"

@Module({
  imports: [
    UserAccessModule,
    CompanyModule,
    RbacModule,
    RequestContextModule,
    
    // RbacModule.forFeature({
    //     imports: [
    //       TypeOrmModule,
    //     ],
    //     rbacManagerProvider: rbacManagerFactoryProvider
    //   }
    // ),
  ],
  exports: [
    // RbacModule
  ]
})
export class AppModule {}
