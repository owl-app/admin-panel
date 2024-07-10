import { User } from './user';

export type IAuthResponse = {
	user: User;
	accessToken: string;
	refreshToken: string;
}