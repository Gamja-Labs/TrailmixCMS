import { z } from 'zod';

export const modelSchema = z.object({
    published: z.boolean().optional(),
});

export type Model = z.infer<typeof modelSchema>;
