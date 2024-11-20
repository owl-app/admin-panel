import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

import { PERMISSION_ENITY, ROLE_ENTITY } from '@owl-app/lib-api-core/entity-tokens';
import { AvalilableCollections, PermissionReferType, CrudActions, Permission } from '@owl-app/lib-contracts';

export default class RbacSeeder implements Seeder {
    public async run(
        dataSource: DataSource
    ): Promise<any> {
        const repository =  dataSource.getRepository(ROLE_ENTITY);
        const repositoryPermission =  dataSource.getRepository(PERMISSION_ENITY);

        const permissions: Permission[] = []

        await Promise.all(Object.values(AvalilableCollections).map(async (valueCollection) => {
            Object.values(CrudActions).forEach((valueAction) => {
                permissions.push({
                    name: this.getRouteName(valueCollection, valueAction),
                    description: `${valueCollection} ${valueAction.toLowerCase()}`,
                    refer: PermissionReferType.ROUTE,
                    collection: valueCollection,
                });
            });
        }));

        await repositoryPermission.save(permissions);

        const roleAdmin = {
            name: 'Admin',
            description: 'Admin role',
            permissions 
        }

        console.log(roleAdmin)


        await repository.save(roleAdmin);

        // ---------------------------------------------------

        // const userFactory = factoryMan ager.get(User);
        // // save 1 factory generated entity, to the database
        // await userFactory.save();

        // // save 5 factory generated entities, to the database
        // await userFactory.saveMany(5);
    }

    private getRouteName(collection: string, action: string): string {
        return (`${PermissionReferType.ROUTE}_${collection}_${action}`).toUpperCase();
    }
}