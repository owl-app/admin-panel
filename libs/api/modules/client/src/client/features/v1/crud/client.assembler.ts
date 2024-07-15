import { User } from '@owl-app/lib-contracts'
import { ClassTransformerAsyncAssembler } from '@owl-app/crud-nestjs'
import { Assembler, DeepPartial } from '@owl-app/crud-core'

import { ClientEntity } from '../../../../domain/entity/client.entity'
import { ClientResponse } from '../../../dto/client.response'
import { mapperClient } from '../../../mapping'

import { CreateClientRequest, UpdateClientDto } from './dto'


@Assembler(ClientResponse, ClientEntity)
export class ClientModelAssembler extends ClassTransformerAsyncAssembler<
  ClientResponse,
  ClientEntity,
  CreateClientRequest|UpdateClientDto
> {
  async convertAsyncToCreateEntity(dto: CreateClientRequest): Promise<DeepPartial<ClientEntity>> {
    const model = new ClientEntity();

    model.name = dto.name;

    return model;
  }

  convertToDTO(client: ClientEntity): ClientResponse
  {
    const responseClient = mapperClient.map<ClientEntity, ClientResponse>(client, new ClientResponse());

    return responseClient
  }

  async convertAsyncToDTO(client: Promise<ClientEntity>): Promise<ClientResponse>
  {
    const response = await client;

    return response
  }
}
