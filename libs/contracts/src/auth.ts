import { Company } from './company';
import { Tenant } from './tenant';
import { User } from './user';

export type AuthUserData = {
	id: string,
	username: string
	email: string,
	company: Company,
	tenant: Tenant,
	roles: string[]
}

export type IAuthResponse = {
	user: User;
	accessToken: string;
	refreshToken: string;
}