
import { z } from 'zod';
import * as Codecs from '../utils/codecs';

export const modelSchema = z.object({
    authorization: z.object({
        public: z.boolean().optional(),
        roles: z.array(z.string()).optional(),
        accountIds: z.array(Codecs.ObjectId).optional(),
    }).optional(),
}).meta({
    id: 'Authorization',
});

export type Model = z.infer<typeof modelSchema>;