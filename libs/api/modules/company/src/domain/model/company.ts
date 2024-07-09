import { ICompany, IUser } from '@owl-app/lib-contracts';

export class Company implements ICompany {
	id: string;

	name: string;

	users: IUser[];
}
