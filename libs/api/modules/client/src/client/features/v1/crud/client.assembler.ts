import { User } from '@owl-app/lib-contracts'
import { Assembler, ClassTransformerAssembler, DeepPartial } from '@owl-app/crud-core'

import { ClientEntity } from '../../../../domain/entity/client.entity'
import { ClientResponse } from '../../../dto/client.response'
import { mapperClient } from '../../../mapping'

import { CreateClientRequest, UpdateClientDto } from './dto'


@Assembler(CreateClientRequest, ClientEntity)
export class ClientModelAssembler extends ClassTransformerAssembler<
  CreateClientRequest,
  ClientEntity
> {
  async convertAsyncToCreateEntity(dto: UpdateClientDto&CreateClientRequest): Promise<DeepPartial<ClientEntity>> {
    const model = new ClientEntity();

    model.name = dto.name;

    return model;
  }

  convertToCreateEntity(dto: DeepPartial<UpdateClientDto>): DeepPartial<ClientEntity> | Promise<DeepPartial<ClientEntity>> {
    const model = new ClientEntity();

    model.name = 'LALALA';

    return model;
  }

  convertToDTO(client: ClientEntity): CreateClientRequest
  {
    const responseClient = mapperClient.map<ClientEntity, CreateClientRequest>(client, new CreateClientRequest());

    return responseClient
  }

  async convertAsyncToDTO(client: Promise<ClientEntity>): Promise<CreateClientRequest>
  {
    const response = await client;

    const responseClient = mapperClient.map<ClientEntity, CreateClientRequest>(response, new CreateClientRequest());

    return responseClient
  }
}
