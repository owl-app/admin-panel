import { IUser } from '@owl-app/lib-contracts';

export class User implements IUser {
	id: string;

	email: string;

	username?: string;

	firstName?: string;

	lastName?: string;

	phoneNumber?: string;

	passwordHash?: string;

	isActive?: boolean;

	hashRefreshToken?: string;

	lastLogin?: Date;
}
