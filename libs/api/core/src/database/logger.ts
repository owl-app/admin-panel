import { AbstractLogger, LogLevel, LogMessage, QueryRunner } from 'typeorm';

export class MyCustomLogger extends AbstractLogger {
  /**
   * Write log to specific output.
   */
  protected writeLog(
    level: LogLevel,
    logMessage: LogMessage | LogMessage[],
    queryRunner?: QueryRunner
  ) {
    const messages = this.prepareLogMessages(logMessage, {
      highlightSql: false,
    });
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    const requestUrl =
      queryRunner && queryRunner.data['request']
        ? '(' + queryRunner.data['request'].url + ') '
        : '';
    console.log(requestUrl + 'executing query: ' + query);
  }
}
