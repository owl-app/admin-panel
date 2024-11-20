import { DataSource } from 'typeorm';
import { NestFactory } from '@nestjs/core';

import { BootstrapModule } from '../bootstrap.module';
import { runSeeders } from 'typeorm-extension';
import RbacSeeder from './seeds/Rbac';
import UserSeeder from './seeds/User';

async function runSeeder() {
  const app = await NestFactory.create(BootstrapModule);
  const dataSource = app.get(DataSource);
  await runSeeders(dataSource, {
    seeds: [RbacSeeder, UserSeeder]
});
  await app.close();
}
runSeeder();