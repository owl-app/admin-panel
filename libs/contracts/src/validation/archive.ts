import * as v from 'valibot'

export const archiveValidationSchema = v.object({
  archived: v.optional(
      v.boolean()
    , false),
});

export type ArchiveRequest = v.InferInput<typeof archiveValidationSchema>;