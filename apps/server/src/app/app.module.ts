import { Module } from '@nestjs/common';
import { RegistryServiceModule } from "@owl-app/registry-nestjs";

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Injectable } from '@nestjs/common';

@Injectable()
export class TestRbacRule
{
  execute(): boolean
  {

    return false;
  }
}

@Module({
  imports: [
    RegistryServiceModule.forFeature<TestRbacRule>({
      name: 'SERVICE_REGISTRY_RULES_NAME',
      services: {
        test_rbac: TestRbacRule
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
