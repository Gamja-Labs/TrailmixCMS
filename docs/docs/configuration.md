# Configuration

## Examples

For the full recommended setup, see the example projects:

[https://github.com/gamja-labs/trailmix-cms/tree/main/examples](https://github.com/gamja-labs/trailmix-cms/tree/main/examples)


## Environment Variables

Set the following environment variables:

```bash
# MongoDB Configuration
MONGODB_CONNECTION_STRING=mongodb+srv://..  
# (Optional, database name defaults to "main")
MONGODB_DATABASE_NAME=your-db-name

# Clerk
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Application Configuration
NODE_ENV=development
PORT=3000
```

## Module Setup

Import the `DatabaseModule` and `CmsModule` in your NestJS application:

```typescript
import { DatabaseModule } from '@trailmix-cms/db';
import { CmsModule } from '@trailmix-cms/cms';

@Module({
    imports: [
        DatabaseModule,
        CmsModule.forRoot()
    ],
})
export class AppModule {}
```

## Advanced Configuration

### Extending the Base Account Entity Schema

All base entities can be extended to add custom fields. The base `Account` schema from `@trailmix-cms/models` provides the foundation, which you can extend using Zod's `.extend()` method.

```typescript
import { CmsModule } from '@trailmix-cms/cms';
import { Account } from '@trailmix-cms/models';

import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const extendedAccountEntitySchema = Account.entitySchema.extend({
    name: z.string(),
});

type ExtendedAccountEntity = z.infer<typeof extendedAccountEntitySchema>;

const extendedAccountDtoSchema = extendedAccountEntitySchema.extend({}).meta({
    id: 'AccountDto',
});

export class AccountDto extends createZodDto(extendedAccountDtoSchema) { }


@Module({
    imports: [
        CmsModule.forRoot({
            entities: {
                accountSchema: extendedAccountEntitySchema,
                accountDtoSchema: extendedAccountDtoSchema,
                accountDto: AccountDto,
            },
        }),
    ],
})
export class AppModule {}
```

### Adding Custom Indexes

You can add custom indexes to the account collection by providing an `accountSetup` function in the `CmsModule.forRoot()` configuration. This function receives the MongoDB collection instance and allows you to create indexes:

```typescript
import { CmsModule } from '@trailmix-cms/cms';
import { Account } from '@trailmix-cms/models';
import { z } from 'zod';
import type { Collection } from 'mongodb';

@Module({
    imports: [
        CmsModule.forRoot({
            entities: {
                accountSetup: async (collection: Collection<Account.Entity>) => {
                    // Create a sparse index on the 'name' field
                    await collection.createIndex({ name: 1 }, { sparse: true });
                },
            },
        }),
    ],
})
export class AppModule {}
```

## Next Steps

- Learn about [Database Models](./database-models.md)
- Set up [Database Collections](./database-collections.md)



