import { z } from 'zod';
import { ObjectId, DateTime } from './utils/codecs';

export const baseEntitySchema = z.object({
    _id: ObjectId,
    created_at: DateTime,
    updated_at: DateTime.optional(),
});

export type BaseEntity = z.infer<typeof baseEntitySchema>;