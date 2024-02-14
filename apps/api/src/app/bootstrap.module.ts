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
import { DatabaseModule } from './database.module'
import loggerFactory from './logger.factory'
import config from '../config'

@Module({
  imports: [
      AppModule,
      DatabaseModule,
      ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: [`.env.${process.env.NODE_ENV}.local`, `.env.${process.env.NODE_ENV}`],
          load: config,
      }),
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
