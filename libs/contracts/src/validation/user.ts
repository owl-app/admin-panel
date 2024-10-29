import * as v from 'valibot'

export const userValidationSchema = v.object({
  email: v.optional(
    v.pipe(
      v.string(),
      v.nonEmpty('Field is required')
    ), ''),
  role: 
  v.pipe(
    v.custom((input) => input !== undefined, 'Field is required'),
    v.nonNullish(v.object({
      name: v.string(),
      description: v.string(),
    })),
  )
});

export type UserRequest = v.InferInput<typeof userValidationSchema>;