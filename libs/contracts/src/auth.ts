import { IUser } from './user';
export type IAuthResponse = {
	user: IUser;
	accessToken: string;
	refreshToken: string;
}