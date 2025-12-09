import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import * as models from '@trailmix-cms/models';

export const AuditContext = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<FastifyRequest>();
        if (!request.account) {
            // TODO: Log this error
            throw new InternalServerErrorException('No account found in request');
        }
        const auditContext: models.AuditContext.Model = {
            account_id: request.account._id,
            system: false,
        };
        return auditContext;
    },
); 