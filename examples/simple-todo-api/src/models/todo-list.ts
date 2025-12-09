import { z } from 'zod';
import { Base } from '@trailmix-cms/models';

export const entitySchema = Base.baseEntitySchema.extend({
    name: z.string(),
}).meta({
    id: 'TodoList',
});

export type Entity = z.infer<typeof entitySchema>;