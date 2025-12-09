import { Collection, OptionalUnlessRequiredId } from 'mongodb';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ZodType } from 'zod';

import { Text } from '@trailmix-cms/models';
import { Collections, DatabaseService, DocumentCollection, AuditedCollection } from '@trailmix-cms/db';
import { CMSCollectionName, PROVIDER_SYMBOLS } from '../constants';
import { CollectionConfig } from '../types/collection-config';

type Record = Text.Entity
const collectionName = CMSCollectionName.Text;

@Injectable()
export class TextCollection<T extends Record = Record> extends AuditedCollection<T> implements OnModuleInit {
    public readonly collectionName = collectionName;

    constructor(
        @Inject(PROVIDER_SYMBOLS.TRAILMIXCMS_CMS_TEXT_SCHEMA) protected readonly entitySchema: ZodType<OptionalUnlessRequiredId<T>>,
        @Inject(PROVIDER_SYMBOLS.TRAILMIXCMS_CMS_TEXT_SETUP) protected readonly setup: (colection: Collection<T>) => Promise<void>,
        @Inject(PROVIDER_SYMBOLS.TRAILMIXCMS_CMS_TEXT_CONFIG) protected readonly config: CollectionConfig,
        @DocumentCollection(collectionName) protected readonly collection: Collection<T>,
        protected readonly databaseService: DatabaseService,
        protected readonly auditCollection: Collections.AuditCollection
    ) {
        super(collection, databaseService, auditCollection);
    }

    async onModuleInit() {
        if (!this.config.disableDefaultIndexes) {
            await this.collection.createIndex({ guid: 1 }, { unique: true });
        }
        await this.setup(this.collection);
    }
} 