import { Archivable } from "./archive";
import { Client } from "./client";
import { TenantAware } from "./tenant";
import { Timestampable } from "./timestampable";

export type Project = TenantAware & Timestampable & Archivable & {
  id: string;
  client: Client;
  name: string;
}
