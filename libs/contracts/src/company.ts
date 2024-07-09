import { IUser } from "./user";

export type Company = {
	id: string;
	
	name: string;

	users: IUser[]
}