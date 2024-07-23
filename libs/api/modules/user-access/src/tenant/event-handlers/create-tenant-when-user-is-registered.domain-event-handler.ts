import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { InjectRepository } from '@owl-app/lib-api-bulding-blocks/typeorm/common/tenant-typeorm.decorators';
import { TenantRepository } from '@owl-app/lib-api-bulding-blocks/tenant-typeorm/tenant.repository';

import { UserRegisteredDomainEvent } from '../../domain/events/user-registered.domain-event'
import { TenantEntity } from '../../domain/entity/tenant.entity';

@Injectable()
export class CreateTenantWhenUserIsRegisteredDomainEventHandler {
  constructor(
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: TenantRepository<TenantEntity>
  ) {}

  // Handle a Domain Event by performing changes to other aggregates (inside the same Domain).
  @OnEvent(UserRegisteredDomainEvent.name, { async: true, promisify: true })
  async handle(event: UserRegisteredDomainEvent): Promise<any> {
    const tenant = new TenantEntity({ name: event.email, users: [{ id: event.id }] });

    return this.tenantRepository.save(this.tenantRepository.create(tenant));
  }
}
