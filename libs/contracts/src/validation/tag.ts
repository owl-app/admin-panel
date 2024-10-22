import * as v from 'valibot'

export const tagValidationSchema = v.object({
  name: v.optional(
    v.pipe(
      v.string(),
      v.nonEmpty('Field is required')
    ), ''),
  color: v.optional(
    v.pipe(
      v.string(),
      v.nonEmpty('Field is required')
    ), ''),
});

export type TagRequest = v.InferInput<typeof tagValidationSchema>;