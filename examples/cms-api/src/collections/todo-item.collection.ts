import { Collection } from 'mongodb';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DocumentCollection, DatabaseService, Collections, AuditedCollection } from '@trailmix-cms/db';
import { TodoItem } from '../models';
import { CollectionName } from '../constants';

type Entity = TodoItem.Entity
const collectionName = CollectionName.TodoItem;

@Injectable()
export class TodoItemCollection extends AuditedCollection<Entity> implements OnModuleInit {
    private readonly logger = new Logger(this.constructor.name);
    public readonly collectionName = collectionName;
    public readonly entitySchema = TodoItem.entitySchema;

    constructor(
        @DocumentCollection(collectionName)
        protected readonly collection: Collection<Entity>,
        protected readonly databaseService: DatabaseService,
        protected readonly auditCollection: Collections.AuditCollection
    ) {
        super(collection, databaseService, auditCollection);
    }

    async onModuleInit() {
        this.logger.verbose(`creating custom indexes for collection_${collectionName}`)
        await this.collection.createIndex({ list_id: 1 });
    }
} 