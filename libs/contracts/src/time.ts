import { TenantAware } from "./tenant";
import { Timestampable } from "./timestampable";
import { User } from "./user";

export type Time = TenantAware & Timestampable & {
  id: string;
  user: User;
  timeIntervalStart: Date;
  timeIntervalEnd: Date;
  description: string;
}
