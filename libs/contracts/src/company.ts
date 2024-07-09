import { IUser } from "./user";

export interface ICompany {
	id: string;
	
	name: string;

	users?: IUser[]
}

// export interface IUserRequest {
// 	email: string;
// 	password?: string;
// 	firstName?: string;
// 	lastName?: string;
// 	phoneNumber?: string;
// }

// export interface IUserResponse {
// 	id?: string;
// 	email: string;
// 	firstName?: string;
// 	lastName?: string;
// }