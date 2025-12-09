import { Collection, OptionalUnlessRequiredId } from 'mongodb';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ZodType } from 'zod';
import { Account } from '@trailmix-cms/models';
import { Collections, DatabaseService, DocumentCollection, AuditedCollection } from '@trailmix-cms/db';

import { CMSCollectionName, PROVIDER_SYMBOLS } from '../constants';
import { CollectionConfig } from '../types/collection-config';

type Record = Account.Entity
const collectionName = CMSCollectionName.Account;

@Injectable()
export class AccountCollection<T extends Record = Record> extends AuditedCollection<T> implements OnModuleInit {
    private readonly logger = new Logger(this.constructor.name);
    protected readonly collectionName = collectionName;

    constructor(
        @Inject(PROVIDER_SYMBOLS.TRAILMIXCMS_CMS_ACCOUNT_SCHEMA) protected readonly entitySchema: ZodType<OptionalUnlessRequiredId<T>>,
        @Inject(PROVIDER_SYMBOLS.TRAILMIXCMS_CMS_ACCOUNT_SETUP) protected readonly setup: (collection: Collection<T>) => Promise<void>,
        @Inject(PROVIDER_SYMBOLS.TRAILMIXCMS_CMS_ACCOUNT_CONFIG) protected readonly config: CollectionConfig,
        @DocumentCollection(collectionName) collection: Collection<T>,
        databaseService: DatabaseService,
        auditCollection: Collections.AuditCollection,
    ) {
        super(collection, databaseService, auditCollection);
    }

    async onModuleInit() {
        this.logger.verbose(`creating custom indexes for collection_${collectionName}`)
        if (!this.config.disableDefaultIndexes) {
            await this.collection.createIndex({ user_id: 1 }, { unique: true, sparse: true });
        }
        await this.setup(this.collection);
    }
}
