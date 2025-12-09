import { Module, Inject } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { connectionFactory } from './connection.factory';
import { collectionServices } from './collections';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config';
import { collectionFactory } from './collection.factory';
import { InternalCollectionName } from './constants';
import { buildCollectionToken } from './utils/build-collection-token';


@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
        }),
    ],
    providers: [
        DatabaseService,
        connectionFactory,
        ...collectionServices,
        ...Object.values(InternalCollectionName).map(collectionName => collectionFactory(collectionName))
    ],
    exports: [
        DatabaseService,
        connectionFactory,
        ...collectionServices,
        ...Object.values(InternalCollectionName).map(buildCollectionToken)
    ]
})
export class DatabaseModule { }
