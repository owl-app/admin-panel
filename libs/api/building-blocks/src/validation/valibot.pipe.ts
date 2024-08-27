import { PipeTransform } from '@nestjs/common';
import { BaseSchema, BaseIssue, parse, flatten, ValiError, FlatErrors } from 'valibot';
import { ValidationErrorException } from './validation-error.exception';
import { isObject } from '@owl-app/utils';


export class ValibotValidationPipe implements PipeTransform {
  constructor(private schema: BaseSchema<unknown, unknown, BaseIssue<unknown>> ) {}

  transform(value: unknown) {
    try {
      const parsedValue = parse(this.schema, value);
console.log(parsedValue)
      return parsedValue;
    } catch (error: any) {
      console.log(error)
      throw new ValidationErrorException(this.flattenErrors(error));
    }
  }

  private flattenErrors(error: ValiError<BaseSchema<unknown, unknown, BaseIssue<unknown>>>): FlatErrors<undefined> {
    return flatten(error.issues)?.nested;
  }
}