import { User } from './user';

export type Company = {
  id: string;
  name: string;
  users: User[];
}
