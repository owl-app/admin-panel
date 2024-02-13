import { IUser } from "@owl-app/lib-contracts";

export interface IUserRepository {
  findOneByIdString(id: string): Promise<IUser>;

  getUserByEmail(email: string): Promise<IUser>;

  updateLastLogin(username: string): Promise<void>;

  updateRefreshToken(username: string, refreshToken: string): Promise<void>;
}

export const IUserRepository = Symbol('IUserRepository');