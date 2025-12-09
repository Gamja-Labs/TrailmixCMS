import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ObjectId } from 'bson';

export function validateObjectId(value: string, metadata: ArgumentMetadata) {
    if (!ObjectId.isValid(value))
        throw new BadRequestException(metadata.data ? `${metadata.data} is not a valid ObjectId in ${metadata.type}` : `Invalid ObjectId in ${metadata.type}`);
    return new ObjectId(value);
}
