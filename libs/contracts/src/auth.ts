import { Company } from './company';
import { User } from './user';

export type AuthUserData = {
	id: string,
	username: string
	email: string,
	company: Company,
	roles: string[]
}

export type IAuthResponse = {
	user: User;
	accessToken: string;
	refreshToken: string;
}