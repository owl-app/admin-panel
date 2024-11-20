import chalk from 'chalk'
import { DataSource } from 'typeorm';
import { NestFactory } from '@nestjs/core';

import { BootstrapModule } from '../app/bootstrap.module';
import { runSeeders } from 'typeorm-extension';
import RbacSeeder from './seeds/Rbac';
import UserSeeder from './seeds/User';

console.log(chalk.green('Running seeders...'));
console.log(chalk.green(`Environment: ${process.env.APP_ENV} \n`));

async function runSeeder() {
  const app = await NestFactory.create(BootstrapModule);
  const dataSource = app.get(DataSource);
  await runSeeders(dataSource, {
    seedTracking: process.env.APP_ENV === 'dev',
    seeds: [RbacSeeder, UserSeeder],
  });
  await app.close();
}
runSeeder();