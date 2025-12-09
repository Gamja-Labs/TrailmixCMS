import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import * as models from '@trailmix-cms/models';

export function buildAccountContextDecorator<T extends models.Account.Entity = models.Account.Entity>(): ParameterDecorator {
    return createParamDecorator(
        (data: unknown, ctx: ExecutionContext) => {
            const request = ctx.switchToHttp().getRequest<FastifyRequest>();
            return request.account as T;
        },
    );
}

export const AccountContext = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<FastifyRequest>();
        return request.account as any;
    },
);
