import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { TAG_ENTITY } from '@owl-app/lib-api-core/entity-tokens';

export default class TagSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        const repository =  dataSource.getRepository(TAG_ENTITY);
        // await repository.insert([
        //     {
        //       name: 'test 2222'
        //     }
        // ]);

        // ---------------------------------------------------

        // const userFactory = factoryManager.get(User);
        // // save 1 factory generated entity, to the database
        // await userFactory.save();

        // // save 5 factory generated entities, to the database
        // await userFactory.saveMany(5);
    }
}