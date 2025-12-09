export const InternalCollectionName = {
    Audit: 'audit',
} as const;

export type InternalCollectionName = typeof InternalCollectionName[keyof typeof InternalCollectionName];
