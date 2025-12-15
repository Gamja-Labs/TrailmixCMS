import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { Audit } from '@trailmix-cms/models';
 
export const AuditListResponseSchema = z.object({
    items: z.array(Audit.entitySchema),
    count: z.number(),
});
export class AuditListResponseDto extends createZodDto(AuditListResponseSchema) { }