import { User } from './user';

export type AuthUserData = {
	id: string,
	username: string
	email: string,
	companies: string[],
}

export type IAuthResponse = {
	user: User;
	accessToken: string;
	refreshToken: string;
}