import * as v from 'valibot'

export const projectValidationSchema = v.object({
  name: v.optional(
    v.pipe(
      v.string(),
      v.nonEmpty('Field is required')
    ), ''),
});

export type ProjectRequest = v.InferInput<typeof projectValidationSchema>;