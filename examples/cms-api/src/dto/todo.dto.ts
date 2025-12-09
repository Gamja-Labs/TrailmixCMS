import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { entitySchema as TodoListEntitySchema } from '../models/todo-list';
import { entitySchema as TodoItemEntitySchema } from '../models/todo-item';
import { Codecs, InternalFields } from '@trailmix-cms/models';

// Todo List Schemas
export const CreateTodoListSchema = TodoListEntitySchema.omit(InternalFields);
export class CreateTodoListDto extends createZodDto(CreateTodoListSchema) { }

export const UpdateTodoListSchema = TodoListEntitySchema.omit(InternalFields).partial();
export class UpdateTodoListDto extends createZodDto(UpdateTodoListSchema) { }

export const TodoListResponseSchema = TodoListEntitySchema;
export class TodoListResponseDto extends createZodDto(TodoListResponseSchema) { }

export const TodoListListResponseSchema = z.object({
    items: z.array(TodoListEntitySchema),
    count: z.number(),
});
export class TodoListListResponseDto extends createZodDto(TodoListListResponseSchema) { }

// Todo Item Schemas
export const CreateTodoItemSchema = TodoItemEntitySchema.omit(InternalFields);
export class CreateTodoItemDto extends createZodDto(CreateTodoItemSchema) { }

export const UpdateTodoItemSchema = TodoItemEntitySchema.omit(InternalFields).partial();
export class UpdateTodoItemDto extends createZodDto(UpdateTodoItemSchema) { }

export const TodoItemResponseSchema = TodoItemEntitySchema;
export class TodoItemResponseDto extends createZodDto(TodoItemResponseSchema) { }

export const TodoItemListResponseSchema = z.object({
    items: z.array(TodoItemEntitySchema),
    count: z.number(),
});
export class TodoItemListResponseDto extends createZodDto(TodoItemListResponseSchema) { }

export const TodoItemListQuerySchema = z.object({
    list_id: Codecs.ObjectId,
});
export class TodoItemListQueryDto extends createZodDto(TodoItemListQuerySchema) { }


