export function buildCollectionToken(collectionName: string) {
    return `COLLECTION_${collectionName}`;
}

export function buildCollectionTokens(collectionNames: string[]) {
    return collectionNames.map(buildCollectionToken);
}