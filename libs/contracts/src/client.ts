import { TenantAware } from "./tenant";
import { Timestampable } from "./timestampable";

export type Client = TenantAware & Timestampable &{
  id: string;
  name: string;
  email: string;
  address: string;
  description: string;
}
