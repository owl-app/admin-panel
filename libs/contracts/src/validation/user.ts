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

export const profileUserValidationSchema = v.pipe(
  v.object({
    firstName: v.pipe(
      v.string(),
      v.nonEmpty('Field is required'),
    ),
    lastName: v.pipe(
      v.string(),
      v.nonEmpty('Field is required'),
    ),
    passwordNew: v.pipe(
      v.string(),
      v.minLength(8, 'Your password must have 8 characters or more')
    ),
    passwordNewRepeat: v.string(),
  }),
  v.transform((input) => {
    let data = input;
    if (input.passwordNew === undefined) {
      data = { ...input, passwordNew: '' };
    }

    if (input.passwordNewRepeat === undefined) {
      data = { ...input, passwordNewRepeat: '' };
    }

    return data;
  }),
  v.forward(
    v.partialCheck(
      [['passwordNew'], ['passwordNewRepeat']],
      (input) => input.passwordNew === input.passwordNewRepeat,
      'The two passwords do not match'
    ),
    ['passwordNewRepeat']
  )
);

export type UserCreateRequest = v.InferInput<typeof createUserValidationSchema>;
export type UserUpdateRequest = v.InferInput<typeof updateUserValidationSchema>;
export type ProfileRequest = v.InferInput<typeof profileUserValidationSchema>;