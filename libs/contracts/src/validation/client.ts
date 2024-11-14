import * as v from 'valibot'

export const createClientValidationSchema = v.object({
  name: v.optional(
    v.pipe(
      v.string(),
      v.nonEmpty('Field is required')
    ), ''),
});

export const updateClientValidationSchema = v.object({
  name: v.optional(
    v.pipe(
      v.string(),
      v.nonEmpty('Field is required')
    ), ''),
});

export type CreateClientRequest = v.InferInput<typeof createClientValidationSchema>;
export type UpdateClientRequest = v.InferInput<typeof updateClientValidationSchema>;