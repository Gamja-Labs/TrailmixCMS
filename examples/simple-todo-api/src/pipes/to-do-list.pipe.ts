import { Injectable } from '@nestjs/common';
import { TodoList } from '../models';
import { BaseEntityByIdPipe } from '@trailmix-cms/utils';
import { TodoListCollection } from '../collections';

@Injectable()
export class TodoListByIdPipe extends BaseEntityByIdPipe<TodoList.Entity> {
    constructor(
        protected readonly collection: TodoListCollection
    ) {
        super(collection);
    }
}