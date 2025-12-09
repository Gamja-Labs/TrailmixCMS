import { ObjectId as ObjectIdType } from 'bson';
import { z } from 'zod';
import { ObjectIdRegex } from './objectId';

export const ObjectId = z.codec(
    z.string().regex(ObjectIdRegex),
    z.instanceof(ObjectIdType), {
    decode: (string) => new ObjectIdType(string),
    encode: (objectId) => objectId.toString(),
});

export const DateTime = z.codec(
    z.iso.datetime(),
    z.date(), {
    decode: (isoString) => new Date(isoString),
    encode: (date) => date.toISOString(),
});