import { Account } from '@trailmix-cms/models';
import { z } from 'zod';

// extend the base account schema
export const entitySchema = Account.entitySchema.extend({
    name: z.string(),
});

export type Entity = z.infer<typeof entitySchema>;