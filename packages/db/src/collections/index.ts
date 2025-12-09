import { AuditCollection } from './audit.collection';
import { collectionFactory } from '../collection.factory';
import { InternalCollectionName } from '../constants';

export { AuditCollection } from './audit.collection';

export const collectionServices = [
    AuditCollection,
];

export const mongoDbCollectionProviders = [
    collectionFactory(InternalCollectionName.Audit),
];
