import { EventEmitter2 } from "@nestjs/event-emitter";

import { Timestampable } from "@owl-app/lib-contracts";
import { DomainEvent } from "../../event/domain-event.base";

export default class BaseEntity implements Timestampable {
    id: string;

    createdAt: Date;

    updatedAt: Date;

    private _domainEvents: DomainEvent[] = [];

    get domainEvents(): DomainEvent[] {
      return this._domainEvents;
    }
  
    public addEvent(domainEvent: DomainEvent): void {
      this._domainEvents.push(domainEvent);
    }
  
    public clearEvents(): void {
      this._domainEvents = [];
    }
  
    public async publishEvents(
      id: string,
      eventEmitter: EventEmitter2,
    ): Promise<void> {
      await Promise.all(
        this.domainEvents.map(async (event) => {
          return await eventEmitter.emitAsync(event.eventName ?? event.constructor.name, Object.assign(event, { id }));
        }),
      );
      this.clearEvents();
    }
}