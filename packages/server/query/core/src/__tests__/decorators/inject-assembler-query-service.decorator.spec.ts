import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import {
  DefaultAssembler,
  InjectAssemblerQueryService,
  NoOpQueryService,
  QueryService,
} from '../..';

import { getAssemblerQueryServiceToken } from '../../lib/decorators/helpers';

describe('@InjectAssemblerQueryService', () => {
  class Foo {
    str!: string;
  }

  class Bar {
    num!: string;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  class TestAssembler extends DefaultAssembler<Foo, Bar> {}

  it('call inject with the correct key', async () => {
    @Injectable()
    class TestService {
      constructor(
        @InjectAssemblerQueryService(TestAssembler)
        readonly service: QueryService<Foo>
      ) {}
    }

    const noopQueryService = new NoOpQueryService<Foo>();
    const moduleRef = await Test.createTestingModule({
      providers: [
        TestService,
        {
          provide: getAssemblerQueryServiceToken(TestAssembler),
          useValue: noopQueryService,
        },
      ],
    }).compile();
    const testService = moduleRef.get(TestService);
    expect(testService).toBeInstanceOf(TestService);
    return expect(testService.service).toBe(noopQueryService);
  });
});
