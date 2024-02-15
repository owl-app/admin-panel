import { Module } from '@nestjs/common'
// import { RbacModule } from '@owl/api-rbac';
// import { rbacManagerFactoryProvider } from '@owl-app/rbac-storage-typeorm';
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserAccessModule } from '@owl-app/lib-api-module-user-access/user-access.module'

import { RequestContextModule } from "@owl-app/request-context-nestjs"

@Module({
  imports: [
    UserAccessModule,
    //AuthModule,
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
