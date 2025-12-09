import { Injectable, Inject, OnApplicationShutdown } from '@nestjs/common';
import { connectionFactory } from './connection.factory';

import * as mongodb from 'mongodb';
import { ClientSession } from 'mongodb';

type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
    public readonly db: mongodb.Db;
    constructor(
        @Inject(connectionFactory.provide) private readonly connection: Awaited<ReturnType<typeof connectionFactory.useFactory>>
    ) {
        this.db = connection.db;
    }

    startSession() {
        return this.connection.client.startSession();
    }

    async withTransaction<T>({ session }: { session?: ClientSession }, fn: (session: ClientSession) => Promise<T>) {
        if (session) {
            return await fn(session);
        }
        session = await this.connection.client.startSession();
        const result = await session.withTransaction(async () => {
            const result = await fn(session);
            return result;
        });
        await session.endSession();
        return result;
    }

    onApplicationShutdown(signal: string) {
        this.connection.client.close();
    }
}
