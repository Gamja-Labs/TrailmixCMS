import { Collection, OptionalUnlessRequiredId } from 'mongodb';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { File } from '@trailmix-cms/models';
import { ZodType } from 'zod';

import { Collections, DatabaseService, DocumentCollection, AuditedCollection } from '@trailmix-cms/db';
import { CMSCollectionName, PROVIDER_SYMBOLS } from '../constants';
import { CollectionConfig } from '../types/collection-config';

type Record = File.Entity
const collectionName = CMSCollectionName.File;

@Injectable()
export class FileCollection<T extends Record = Record> extends AuditedCollection<T> implements OnModuleInit {
    private readonly logger = new Logger(this.constructor.name);
    public readonly collectionName = collectionName;

    constructor(
        @Inject(PROVIDER_SYMBOLS.TRAILMIXCMS_CMS_FILE_SCHEMA) protected readonly entitySchema: ZodType<OptionalUnlessRequiredId<T>>,
        @Inject(PROVIDER_SYMBOLS.TRAILMIXCMS_CMS_FILE_SETUP) protected readonly setup: (colection: Collection<T>) => Promise<void>,
        @Inject(PROVIDER_SYMBOLS.TRAILMIXCMS_CMS_FILE_CONFIG) protected readonly config: CollectionConfig,
        @DocumentCollection(collectionName) protected readonly collection: Collection<T>,
        protected readonly databaseService: DatabaseService,
        protected readonly auditCollection: Collections.AuditCollection
    ) {
        super(collection, databaseService, auditCollection);
    }

    async onModuleInit() {
        this.logger.verbose(`creating custom indexes for collection_${collectionName}`)
        if (!this.config.disableDefaultIndexes) {
            await this.collection.createIndex({ external_id: 1 });
            await this.collection.createIndex({ guid: 1 }, { unique: true, sparse: true });
        }
        await this.setup(this.collection);
    }
} 