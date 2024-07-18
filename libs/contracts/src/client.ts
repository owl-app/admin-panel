import { Company } from "./company";

export type Client = {
  id: string;
  name: string;
  email: string;
  address: string;
  description: string;
  company: Company;
}
