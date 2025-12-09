import { z } from 'zod';
import { baseEntitySchema } from '../base';

export const entitySchema = baseEntitySchema.extend({
    user_id: z.string(),
    roles: z.array(z.string()),
}).meta({
    id: 'BaseAccount',
});

export type Entity = z.infer<typeof entitySchema>;
