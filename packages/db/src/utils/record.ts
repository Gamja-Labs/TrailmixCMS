import { ObjectId, OptionalId } from 'mongodb';

export type Creatable<T> = OptionalId<Omit<T, 'created_at' |'expire_at'> & { created_at?: Date }>;

export function ensureCreated<T>(record: Creatable<T>) {
    return {
        ...record,
        _id: new ObjectId(),
        created_at: new Date()
    };
}

export function ensureUpdated<T>(record: Creatable<T>) {
    return {
        ...record,
        updated_at: new Date()
    };
}