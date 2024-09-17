import {
  Inject,
  LoggerService,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationShutdown
} from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { ConfigModule, ConfigService} from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'

import { WinstonLoggerModule, WINSTON_MODULE_NEST_PROVIDER } from '@owl-app/winston-logger-nestjs'

import { AppModule } from './app.module'
import loggerFactory from './logger.factory'
import { ErrorHandlersFilter } from '@owl-app/lib-api-core/filters/error-handlers.filter'

@Module({
  imports: [
      AppModule,
      WinstonLoggerModule.forRootAsync({
          useFactory: loggerFactory,
          imports: [ConfigModule],
          inject: [ConfigService],
      }),
      WinstonLoggerModule.forRootAsync({
          useFactory: loggerFactory,
          imports: [ConfigModule],
          inject: [ConfigService],
      }),
      EventEmitterModule.forRoot({
        ignoreErrors: true,
      }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorHandlersFilter,
    },
  ]
})
export class BootstrapModule implements NestModule, OnApplicationShutdown{
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService) {}

  configure(consumer: MiddlewareConsumer) {
      consumer.apply().forRoutes('*');
      
      this.logger.log(`Received shutdown signal:`);
  }

  async onApplicationShutdown(signal: string) {
      if (signal) {
        this.logger.log(`Received shutdown signal: ${signal}`);
      }
  }
}
