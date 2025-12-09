import { Document, Collection, OptionalUnlessRequiredId } from 'mongodb';
import { Creatable, ensureCreated } from './record';
import { Base } from '@trailmix-cms/models';

export async function createDefault<T extends Base.BaseEntity & Document>({ collection, defaultEntity }: { collection: Collection<T>; defaultEntity: Creatable<T>; }) {
    const createdDefault = ensureCreated<T>(defaultEntity) as OptionalUnlessRequiredId<T>;

    const count = await collection.countDocuments({});
    if (count === 0) {
        await collection.insertOne(createdDefault);
    } else {
        const existing = await collection.findOne({});
        if (existing) {
            const { _id, ...defaultFields } = createdDefault;
            await collection.updateOne(
                {},
                { $set: { ...defaultFields, ...existing } as Partial<T> },
                { upsert: true }
            );
        }
    }
}