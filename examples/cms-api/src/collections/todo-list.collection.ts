import { Collection } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { DocumentCollection, DatabaseService, Collections, AuditedCollection } from '@trailmix-cms/db';
import { TodoList } from '../models';
import { CollectionName } from '../constants';

type Record = TodoList.Entity
const collectionName = CollectionName.TodoList;

@Injectable()
export class TodoListCollection extends AuditedCollection<Record> {
    public readonly collectionName = collectionName;
    public readonly entitySchema = TodoList.entitySchema;

    constructor(
        @DocumentCollection(collectionName)
        protected readonly collection: Collection<Record>,
        protected readonly databaseService: DatabaseService,
        protected readonly auditCollection: Collections.AuditCollection
    ) {
        super(collection, databaseService, auditCollection);
    }
} 