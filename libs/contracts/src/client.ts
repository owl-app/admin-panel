import { TenantAware } from "./tenant";

export type Client = TenantAware & {
  id: string;
  name: string;
  email: string;
  address: string;
  description: string;
}
