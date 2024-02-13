import { Module } from '@nestjs/common'
import { AppRequestContextService } from '@owl-app/lib-api-bulding-blocks/infrastructure/context'

import { UserIntegrationModule } from '@owl-app/lib-api-module-user/integration/user-integration.module'

import { IUserGateway, UserGateway } from './user.gateway'

@Module({
  imports: [
    UserIntegrationModule
  ],
  providers: [
    AppRequestContextService,
    {
      provide: IUserGateway,
      useClass: UserGateway
    }
  ],
  exports: [
    IUserGateway
  ]
})
export class UserGatewayModule {}
