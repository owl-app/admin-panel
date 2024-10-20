import { TenantAware } from "./tenant";
import { Timestampable } from "./timestampable";

export type Tag = TenantAware & Timestampable &{
  id: string;
  name: string;
}
