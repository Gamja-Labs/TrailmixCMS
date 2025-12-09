export const CollectionName = {
    TodoList: 'todo-list',
    TodoItem: 'todo-item',
} as const;

export type CollectionName = typeof CollectionName[keyof typeof CollectionName];