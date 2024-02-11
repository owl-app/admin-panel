import { ConfigService } from "@nestjs/config";
import { WinstonModuleOptions, utilities as nestWinstonModuleUtilities } from "@owl/server-core";
import winston from "winston";

export default (configService: ConfigService): WinstonModuleOptions => {
    return {
      transports: [
          new winston.transports.Console({
                format: winston.format.combine(
                  winston.format.timestamp(),
                  winston.format.ms(),
                  nestWinstonModuleUtilities.format.nestLike(configService.get('api.app_name'), {
                    colors: true,
                    prettyPrint: true,
                  }),
                ),
          }),
          new winston.transports.File({ filename: configService.get('logger.file_error_log'), level: 'error' }),
          new winston.transports.File({ filename: configService.get('logger.file_debug_log')}),
      ]
    }
}