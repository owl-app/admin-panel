import { IRoleResponse } from './rbac';
import { User } from './user';

export type AuthUserData = {
	id: string,
	username: string
	email: string,
	companies: string[],
	roles: string[]
}

export type IAuthResponse = {
	user: User;
	accessToken: string;
	refreshToken: string;
}