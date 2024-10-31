import { EntitySchemaColumnOptions } from 'typeorm';

export const ArchiveableSchemaPart = {
  deletedAt: {
    name: 'deleted_at',
    type: 'datetime',
    deleteDate: true,
  } as EntitySchemaColumnOptions,
};
