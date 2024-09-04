import * as v from 'valibot'

export const timeValidationSchema = v.object({
  description: v.optional(
    v.pipe(
      v.string(),
      v.nonEmpty('Field is required')
    ), ''),
  timeIntervalStart: v.optional(
    v.pipe(
      v.string(),
      v.nonEmpty('Field is required')
    ), ''),
  timeIntervalEnd: v.optional(
    v.pipe(
      v.string(),
      v.nonEmpty('Field is required')
    ), ''),
});

export type TimeRequest = v.InferInput<typeof timeValidationSchema>;