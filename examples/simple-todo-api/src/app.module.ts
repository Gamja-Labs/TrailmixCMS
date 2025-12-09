import { Logger, Module } from '@nestjs/common';

import { DatabaseModule } from '@trailmix-cms/db';

import { controllers } from './controllers';
import { collections } from './collections';
import { services } from './services';
import { CollectionName } from './constants';
import { configuration } from './config';
import { ConfigModule } from '@nestjs/config';
import { collectionFactory } from '@trailmix-cms/db';

import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
        }),
        DatabaseModule,
        // CacheModule,
    ],
    controllers: [
        ...controllers,
    ],
    providers: [
        {
            provide: APP_PIPE,
            useClass: ZodValidationPipe,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ZodSerializerInterceptor,
        },
        ...services,
        // ...pipes,
        ...collections,
        ...Object.values(CollectionName).map(collectionName => collectionFactory(collectionName))
    ],
})
export class AppModule { }
