import { Timestampable } from "@owl-app/lib-contracts";

export default class BaseEntity implements Timestampable {
    id: string;

    createdAt: Date;

    updatedAt: Date;
}