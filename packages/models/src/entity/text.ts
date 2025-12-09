import { z } from 'zod';
import { baseEntitySchema } from '../base';
import { modelSchema as authorizationModelSchema } from '../models/authorization';
import { modelSchema as publishableEntitySchema } from '../models/publishable';

export const entitySchema = baseEntitySchema
    .extend(authorizationModelSchema.shape)
    .extend(publishableEntitySchema.shape)
    .extend({
        guid: z.string(),
        content: z.string(),
    }).meta({
        id: 'Text',
    });

export type Entity = z.infer<typeof entitySchema>;