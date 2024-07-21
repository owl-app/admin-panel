import { Company, Tenant, User } from '@owl-app/lib-contracts';
import { RegisterUserProps } from '../user.types';
import { TenantEntity } from './tenant.entity';

export class UserEntity implements User {
  id: string;

  company: Company;

  tenant: Tenant;

  email: string;

  username?: string;

  firstName?: string;

  lastName?: string;

  phoneNumber?: string;

  passwordHash?: string;

  isActive?: boolean;

  hashRefreshToken?: string;

  lastLogin?: Date;

  static register(registerProps: RegisterUserProps): UserEntity {
    const user = new UserEntity();
    Object.assign(user, registerProps);
    /* adding "UserCreated" Domain Event that will be published
    eventually so an event handler somewhere may receive it and do an
    appropriate action. Multiple events can be added if needed. */
    // user.addEvent(
    //   new UserCreatedDomainEvent({
    //     aggregateId: id,
    //     email: props.email,
    //     ...props.address.unpack(),
    //   }),
    // );

    const tenant = new TenantEntity();
    tenant.name = registerProps.email;

    user.tenant = tenant;

    return user;
  }
}
