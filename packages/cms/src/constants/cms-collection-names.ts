export const CMSCollectionName = {
    Account: 'account',
    File: 'file',
    Text: 'text',
} as const;

export type CMSCollectionName = typeof CMSCollectionName[keyof typeof CMSCollectionName];
