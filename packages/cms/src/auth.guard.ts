import { Reflector } from '@nestjs/core';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { getAuth, createClerkClient, ClerkClient } from '@clerk/fastify';
import { Account, Role } from '@trailmix-cms/models';
import { AccountCollection } from './collections';
import { ConfigService } from '@nestjs/config';

import { AppConfig } from './config';
import { ALLOW_ANONYMOUS_KEY, ROLES_KEY } from './decorators/auth.decorator';

declare module 'fastify' {
    interface FastifyRequest {
        account?: Account.Entity
    }
}

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);
    private readonly clerkClient: ClerkClient;

    constructor(
        private reflector: Reflector,
        private accountCollection: AccountCollection,
        private configService: ConfigService<AppConfig>,
    ) {
        this.clerkClient = createClerkClient({
            secretKey: this.configService.get('CLERK_SECRET_KEY'),
        });
    }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<(Role | string)[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        const allowAnonymous = this.reflector.getAllAndOverride<boolean>(ALLOW_ANONYMOUS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        const request = context.switchToHttp().getRequest<FastifyRequest>();

        const { account } = await this.getAccount(context);

        if (!account) {
            if (allowAnonymous) {
                return true;
            }
            throw new UnauthorizedException('Unauthorized request');
        }

        request.account = account;

        if (allowAnonymous) {
            return true;
        }

        // If no roles are required, allow any authenticated user
        if (requiredRoles.length == 0) {
            return true;
        }

        // Check if user has required role
        const hasRole = requiredRoles.some((role) => account?.roles?.includes(role))
            || account?.roles?.includes(Role.Admin);
        if (!hasRole) {
            throw new ForbiddenException('You are not authorized to access this resource');
        }

        return true;
    }

    private async getAccount(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<FastifyRequest>();

        const auth = getAuth(request)

        if (!auth.userId) {
            return {};
        }

        // const cachedUser = await this.userCache.getUser(auth.userId);
        // if (cachedUser) {
        //     return {
        //         account: cachedUser.account,
        //         userPublicMetadata: cachedUser.metadata,
        //     };
        // }

        const user = await this.clerkClient.users.getUser(auth.userId)
        const account = await this.accountCollection.upsertOne({ user_id: auth.userId }, {
            $set: {
                user_id: auth.userId,
            }
        }, {
            system: true,
            message: 'Account upserted',
            source: AuthGuard.name,
        });

        // TODO: Cache user
        // await this.userCache.cacheUser(auth.userId, {
        //     account: account!,
        //     metadata: user.publicMetadata,
        // });

        return {
            account,
            userPublicMetadata: user.publicMetadata,
        };
    }
}