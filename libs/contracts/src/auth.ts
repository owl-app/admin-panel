import { IUser } from './user';
export interface IAuthResponse {
	user: IUser;
	token: string;
	refreshToken: string;
}