import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { InjectRepository } from '@owl-app/lib-api-bulding-blocks/typeorm/common/tenant-typeorm.decorators';
import { BaseRepository } from '@owl-app/lib-api-bulding-blocks/database/repository/base.repository';

import { TimeResponse } from '../../../dto/time.response';
import { TimeEntity } from '../../../../domain/entity/time.entity';

export class Watch {

  description: string;

  constructor(request: Partial<Watch> = {}) {
    Object.assign(this, request);
  }
}

@CommandHandler(Watch)
export class WatchHandler implements ICommandHandler<Watch> {
  constructor(
    @InjectRepository(TimeEntity)
    private readonly userRepository: BaseRepository<TimeEntity>
  ) {}

  async execute(command: Watch): Promise<TimeResponse> {
    // await loginValidation.validateAsync(command, { abortEarly: false });

    // const user = await this.userRepository.getUserByEmail(command.email);

    // if (!user || !await this.jwtTokenService.validateToken(command.password, user.passwordHash)
    // ) {
    //   throw new InvalidAuthenticationError();
    // }

    // await this.userRepository.updateLastLogin(user.email);

    // const accessToken = await this.jwtTokenService.getJwtToken(command.email);
    // const refreshToken = await this.jwtTokenService.getJwtRefreshToken(command.email);

    return new TimeResponse()
  }
}
