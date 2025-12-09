
import { z } from 'zod';
import * as Codecs from '../utils/codecs';
import { ObjectId } from 'bson';

export const modelSchema = z.object({
    account_id: Codecs.ObjectId.optional(),
    anonymous: z.boolean().optional(),
    system: z.boolean(),
    source: z.string().optional(),
    message: z.string().optional(),
}).meta({
    id: 'AuditContext',
});

export type Model = z.infer<typeof modelSchema>;
