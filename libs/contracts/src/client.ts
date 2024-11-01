import { SoftDeleteable } from "./common";
import { TenantAware } from "./tenant";
import { Timestampable } from "./timestampable";

export type Client = TenantAware & Timestampable & SoftDeleteable & {
  id: string;
  name: string;
  email: string;
  address: string;
  description: string;
}
