import chalk from 'chalk'
import { DataSource } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { APP_CONFIG_NAME, IConfigApp } from '@owl-app/lib-api-core/config';

import { BootstrapModule } from '../app/bootstrap.module';
import { runSeeders } from 'typeorm-extension';
import RbacSeeder from './seeds/Rbac';
import createUserSeeder from './seeds/User';

console.log(chalk.green('Running seeders...'));
console.log(chalk.green(`Environment: ${process.env.APP_ENV} \n`));

async function runSeeder() {
  const app = await NestFactory.create(BootstrapModule);
  const dataSource = app.get(DataSource);
  const configService = app.get(ConfigService);
  const { password_bcrypt_salt_rounds } = configService.get<IConfigApp>(APP_CONFIG_NAME);

  await runSeeders(dataSource, {
    seedTracking: process.env.APP_ENV === 'dev',
    seeds: [RbacSeeder, createUserSeeder(password_bcrypt_salt_rounds)],
  });

  await app.close();
}
runSeeder();