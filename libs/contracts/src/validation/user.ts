import { first } from 'lodash';
import * as v from 'valibot'

const baseSchema = v.object({
  email: v.optional(
    v.pipe(
      v.string(),
      v.email(),
      v.nonEmpty('Field is required')
    ), ''),
  firstName: v.nullish(v.string(), null),
  lastName: v.nullish(v.string(), null),
  role: v.pipe(
      v.custom((input) => input !== undefined, 'Field is required'),
      v.nonNullish(v.object({
        name: v.string(),
        description: v.string(),
      })),
    ),
});

export const createUserValidationSchema = v.object({
  ...baseSchema.entries,
  password: v.optional(
    v.pipe(
      v.string(),
      v.nonEmpty('Field is required')
    ), ''),
});

export const updateUserValidationSchema = v.object({
  ...baseSchema.entries,
  password: v.optional(
    v.string()
  , '')
});

export type UserCreateRequest = v.InferInput<typeof createUserValidationSchema>;
export type UserUpdateRequest = v.InferInput<typeof updateUserValidationSchema>;