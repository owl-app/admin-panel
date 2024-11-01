import { Archivable } from "./archive";
import { TenantAware } from "./tenant";
import { Timestampable } from "./timestampable";

export type Client = TenantAware & Timestampable & Archivable & {
  id: string;
  name: string;
  email: string;
  address: string;
  description: string;
}
