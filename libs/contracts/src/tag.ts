import { SoftDeleteable } from "./common";
import { TenantAware } from "./tenant";
import { Timestampable } from "./timestampable";

export type Tag = TenantAware & Timestampable & SoftDeleteable & {
  id: string;
  name: string;
  color: string;
}
