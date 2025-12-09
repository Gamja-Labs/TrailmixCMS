import { Injectable, ExecutionContext, Logger, createParamDecorator, NotFoundException } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import * as models from '@trailmix-cms/models';

export interface AccountAuthorization {
    account?: models.Account.Entity;
    roles: (models.Role | string)[];
}

export type AuthorizableEntity = models.Authorization.Model & models.Publishable.Model;

@Injectable()
export class AuthorizationService {
    private readonly logger = new Logger(AuthorizationService.name);

    constructor() { }

    async validateAuthorization<T extends AuthorizableEntity>(accountAuthorization: AccountAuthorization, entity: T) {
        const result = this.checkAccountAuthorizationOnEntity(accountAuthorization, entity);
        if (!result) {
            // TODO: security audit
            throw new NotFoundException('Entity not found');
        }
        return result;
    }

    checkAccountAuthorizationOnEntity<T extends AuthorizableEntity>(accountAuthorization: AccountAuthorization, entity: T) {
        // console.log('checkAccountAuthorizationOnEntity', { accountAuthorization }, { entity });
        const account = accountAuthorization.account;

        if (accountAuthorization.roles.includes(models.Role.Admin)) {
            return true;
        }

        if (!entity.authorization) {
            // Only admin can access entities that have no "authorization"
            // TODO: security audit
            this.logger.warn('Entity has no authorization', { entity });
            return false;
        }

        // IF entity does not have a published property, it is published
        if (entity.published === false) {
            return false;
        }

        if (entity.authorization.public) {
            return true;
        }

        if (entity.authorization.roles?.some(role => accountAuthorization.roles.includes(role))) {
            return true;
        }

        if (account && entity.authorization.accountIds?.some(id => account._id.equals(id))) {
            return true;
        }
        return false;
    }
}

export const AccountAuthorization = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<FastifyRequest>();

        const accountAuthorization: AccountAuthorization = {
            account: request.account,
            roles: request.account?.roles ? request.account.roles.map(role => role as models.Role) : [],
        }
        return accountAuthorization;
    },
)