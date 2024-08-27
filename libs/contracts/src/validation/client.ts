import * as v from 'valibot'

export const clientValidationSchema = v.object({
  name: v.optional(
    v.pipe(
      v.string(),
      v.nonEmpty('Field is required')
    ), ''),
});

export type ClientRequest = v.InferInput<typeof clientValidationSchema>;