import {
  Inject,
  LoggerService,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationShutdown
} from '@nestjs/common'
import { ConfigModule, ConfigService} from '@nestjs/config'
import { AppModule } from './app.module'
import { WinstonLoggerModule, WINSTON_MODULE_NEST_PROVIDER } from '@owl-app/winston-logger-nestjs'
import loggerFactory from './logger.factory'
import { ErrorHandlersFilter } from '@owl-app/lib-api-bulding-blocks/filters/error-handlers.filter'
import { APP_FILTER } from '@nestjs/core'

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
      // HealthIndicatorModule,
      // SharedModule
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
