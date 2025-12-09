import { PipeTransform, Injectable, ArgumentMetadata, NotFoundException } from '@nestjs/common';
import { validateObjectId } from './validation.js';

@Injectable()
export abstract class BaseEntityByIdPipe<T> implements PipeTransform<any> {
    constructor(
        protected readonly collection: {
            collectionName: string;
            get(id: any): Promise<T | null>
        }
    ) { }

    async transform(value: string, metadata: ArgumentMetadata): Promise<T> {
        const id = validateObjectId(value, metadata);
        const record = await this.collection.get(id);
        if (!record) {
            throw new NotFoundException(`Record with Id ${value} does not exist in collection "${this.collection.collectionName}"`);
        }
        return record;
    }
} 