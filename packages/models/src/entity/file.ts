import { z } from 'zod';
import { baseEntitySchema } from '../base';
import { modelSchema as authorizationEntitySchema } from '../models/authorization';
import { modelSchema as publishableEntitySchema } from '../models/publishable';

export const entitySchema = baseEntitySchema
    .extend(publishableEntitySchema.shape)
    .extend(authorizationEntitySchema.shape)
    .extend({
        external_id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        guid: z.string().optional(),
        file_name: z.string(),
        file_extension: z.string(),
        path: z.array(z.string()).optional(),
        size: z.number(),
        encryption: z.object({
            key: z.string(),
            iv: z.string(),
        }).optional(),
    }).meta({
        id: 'File',
    });

export type Entity = z.infer<typeof entitySchema>;
