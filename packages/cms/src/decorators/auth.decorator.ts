import { AuthGuard } from '../auth.guard'
import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { Role } from '@trailmix-cms/models';

export const ALLOW_ANONYMOUS_KEY = 'allowAnonymous';
export const ROLES_KEY = 'roles';

export interface AuthOptions {
    roles?: Role[];
    allowAnonymous?: boolean;
}

export function Auth({ roles = [], allowAnonymous = false }: AuthOptions = {}) {
    return applyDecorators(
        SetMetadata(ROLES_KEY, roles),
        SetMetadata(ALLOW_ANONYMOUS_KEY, allowAnonymous),
        UseGuards(AuthGuard),
        ApiBearerAuth(),
    );
}