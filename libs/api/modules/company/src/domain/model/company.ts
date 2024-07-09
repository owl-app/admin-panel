import type { Company, IUser } from '@owl-app/lib-contracts';

export class CompanyModel implements Company {
	id: string;

	name: string;

	users: IUser[];
}
