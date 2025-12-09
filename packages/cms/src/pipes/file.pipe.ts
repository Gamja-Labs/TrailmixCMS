import { Injectable } from '@nestjs/common';
import { BaseEntityByIdPipe } from '@trailmix-cms/utils';
import { FileCollection } from '../collections/file.collection';
import * as models from '@trailmix-cms/models';

@Injectable()
export class FileByIdPipe extends BaseEntityByIdPipe<models.File.Entity> {
    constructor(
        protected readonly collection: FileCollection
    ) {
        super(collection);
    }
}