import { Module } from '@nestjs/common'
//import { UserModule } from '@owl/api-user';
// import { RbacModule } from '@owl/api-rbac';
// import { rbacManagerFactoryProvider } from '@owl-app/rbac-storage-typeorm';
import { TypeOrmModule } from '@nestjs/typeorm'
//import { AuthModule } from '@owl/api-auth';
import { RequestContextModule } from "@owl-app/request-context-nestjs"

@Module({
  imports: [
    //UserModule,
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
