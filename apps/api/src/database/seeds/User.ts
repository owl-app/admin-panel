import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { USER_ENTITY } from '@owl-app/lib-api-core/entity-tokens';
import { Role, User } from '@owl-app/lib-contracts';
import { Class } from '@owl-app/types';

export default function createUserSeeder(passwordBcryptSaltRounds: number): Class<Seeder> {

  return class UserSeeder implements Seeder {

    public async run(
        dataSource: DataSource
    ): Promise<void> {
      const repository =  dataSource.getRepository(USER_ENTITY);

      const user: Partial<User> = {
        email: 'role_admin@wp.pl',
        firstName: 'Admin',
        lastName: 'Test',
      }

      user.passwordHash = await bcrypt.hash(
        'test',
        passwordBcryptSaltRounds
      );

      user.roles = [{ name: 'ROLE_ADMIN_SYSTEM' } as Role];

      await repository.save(user);
    }

  }
}