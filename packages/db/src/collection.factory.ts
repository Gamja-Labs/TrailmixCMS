import { Collection, CollectionOptions, Document } from 'mongodb';
import { DatabaseService } from './database.service';
import { Logger, Provider } from '@nestjs/common';
import { InternalCollectionName } from './constants';
import { buildCollectionToken } from './utils/build-collection-token';

const logger = new Logger('CollectionFactory');

export type CollectionSetup<T extends Document> = (collection: Collection<T>) => void;

export type CollectionFactoryOptions = {
    disableDefaultIndexes?: boolean;
    mongodbCollectionOptions?: CollectionOptions;
}

export function collectionFactory<T extends Document>(collectionName: InternalCollectionName | string, options?: CollectionFactoryOptions) {
    const provider = {
        provide: buildCollectionToken(collectionName),
        useFactory: async (
            databaseService: DatabaseService,
        ) => {
            logger.verbose(`providing collection_${collectionName}`)
            const collection = databaseService.db.collection<T>(collectionName, options?.mongodbCollectionOptions);
            if (!options?.disableDefaultIndexes) {
                logger.verbose(`creating default indexes for collection_${collectionName}`)
                await collection.createIndex({
                    created_at: 1,
                });
                await collection.createIndex({
                    updated_at: 1,
                }, { sparse: true });
            }
            return collection;
        },
        inject: [DatabaseService]
    };
    return provider;
}