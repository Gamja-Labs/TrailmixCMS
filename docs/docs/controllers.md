# Controllers

Controllers in Trailmix CMS use decorators to handle authentication, authorization, and audit context. This guide shows you how to use these decorators effectively.

## Authentication Decorator

The `@Auth()` decorator protects your controllers and routes, requiring authentication by default. It integrates with Swagger to add bearer auth documentation.

### Basic Usage

Apply `@Auth()` to a controller class to protect all routes:

```typescript
import { Auth } from '@trailmix-cms/cms';

@Auth()
@ApiTags('todo-items')
@Controller('todo-items')
export class TodoItemController {
  // Your controller implementation here
}
```

### Allow Anonymous Access

Use `allowAnonymous: true` to allow unauthenticated requests:

```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Auth } from '@trailmix-cms/cms';

@Auth({ allowAnonymous: true })
@ApiTags('public')
@Controller('public')
export class PublicController {
  @Get('items')
  @ApiOperation({ summary: 'Get public items (no auth required)' })
  @ApiOkResponse({ description: 'Public items.' })
  async getPublicItems() {
    // This endpoint can be accessed without authentication
    return { items: [] };
  }
}
```

You can also apply `@Auth()` with `allowAnonymous` to individual routes:

```typescript
@Auth()
@ApiTags('todo-items')
@Controller('todo-items')
export class TodoItemController {
  @Get()
  @Auth({ allowAnonymous: true })
  @ApiOperation({ summary: 'Get all items (public)' })
  async getAllItems() {
    // This specific route allows anonymous access
    return this.todoItemCollection.find({});
  }

  @Post()
  @ApiOperation({ summary: 'Create item (requires auth)' })
  async createItem(@Body() dto: CreateTodoItemDto) {
    // This route requires authentication
    return this.todoItemCollection.insertOne(dto, auditContext);
  }
}
```

### Role-Based Authorization

Use the `roles` option to restrict access to specific roles:

```typescript
import { Controller, Delete } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Auth, AuditContext } from '@trailmix-cms/cms';
import * as trailmixModels from '@trailmix-cms/models';

@Auth({ roles: trailmixModels.Role.Admin})
@ApiTags('admin')
@Controller('admin')
export class AdminController {
  // Your controller implementation here
}
```

## Retrieving Account Information

Use the `@AccountContext()` decorator to access the authenticated account in your route handlers:

```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Auth, AccountContext } from '@trailmix-cms/cms';
import * as trailmixModels from '@trailmix-cms/models';

@Auth()
@ApiTags('account')
@Controller('account')
export class AccountController {
  @Get()
  @ApiOperation({ summary: 'Get current account info' })
  @ApiOkResponse({ description: 'Account information.' })
  async getAccount(
    @AccountContext() account: trailmixModels.Account.Entity,
  ): Promise<trailmixModels.Account.Entity> {
    // Access the authenticated account
    return account;
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get account profile' })
  async getProfile(
    @AccountContext() account: trailmixModels.Account.Entity,
  ) {
    return {
      id: account._id,
      email: account.email,
      roles: account.roles,
    };
  }
}
```

If you are using an extended account entity, make sure to annotate using your type.

## Using Audit Context

The `@AuditContext()` decorator automatically creates an audit context from the authenticated account. This is required for audited collections:

```typescript
import { Controller, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { Auth, AuditContext } from '@trailmix-cms/cms';
import * as trailmixModels from '@trailmix-cms/models';

@Auth()
@ApiTags('todo-items')
@Controller('todo-items')
export class TodoItemController {
  @Post()
  @ApiOperation({ summary: 'Create a new todo item' })
  @ApiCreatedResponse({
    description: 'Todo item created successfully.',
    type: TodoItemResponseDto,
  })
  async createItem(
    @Body() createDto: CreateTodoItemDto,
    @AuditContext() auditContext: trailmixModels.AuditContext.Model,
  ): Promise<TodoItemResponseDto> {
    // auditContext contains account_id from the authenticated user
    return this.todoItemCollection.insertOne(createDto, auditContext);
  }

  @Put(':itemId')
  @ApiOperation({ summary: 'Update a todo item' })
  @ApiOkResponse({
    description: 'Todo item updated successfully.',
    type: TodoItemResponseDto,
  })
  async updateItem(
    @Param('itemId') itemId: string,
    @Body() updateDto: UpdateTodoItemDto,
    @AuditContext() auditContext: trailmixModels.AuditContext.Model,
  ): Promise<TodoItemResponseDto> {
    return this.todoItemCollection.findOneAndUpdate(
      { _id: itemId },
      { $set: updateDto },
      auditContext,
    );
  }

  @Delete(':itemId')
  @ApiOperation({ summary: 'Delete a todo item' })
  @ApiOkResponse({ description: 'Todo item deleted successfully.' })
  async deleteItem(
    @Param('itemId') itemId: string,
    @AuditContext() auditContext: trailmixModels.AuditContext.Model,
  ): Promise<void> {
    await this.todoItemCollection.deleteOne(itemId, auditContext);
  }
}
```

## Summary

- **`@Auth()`**: Protects routes and requires authentication by default
- **`@Auth({ allowAnonymous: true })`**: Allows unauthenticated access
- **`@Auth({ roles: ['admin'] })`**: Restricts access to specific roles
- **`@AccountContext()`**: Retrieves the authenticated account entity
- **`@AuditContext()`**: Creates an audit context from the authenticated account for use with audited collections

