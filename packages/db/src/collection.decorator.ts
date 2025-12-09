import { Inject } from '@nestjs/common';
import type { InternalCollectionName } from './constants';
import { buildCollectionToken } from './utils/build-collection-token';

export function DocumentCollection(collectionName: string | InternalCollectionName) {
    return Inject(buildCollectionToken(collectionName));
}