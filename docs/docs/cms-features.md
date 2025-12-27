# Auth Guard Hook

The **auth guard hook** is a powerful feature that allows you to execute custom logic when an account is **first created** in the database during authentication.

## How It Works

- When a user authenticates via Clerk, the CMS checks if an account exists in the database
- If the account **doesn't exist**, it's automatically created
- **Only after creating a new account**, the `authGuardHook` function is called with the account entity
- If the account already exists, the hook is **not called** - authentication proceeds normally
- The hook can perform any async operations (database queries, API calls, notifications, etc.)
- The hook must return `true` to allow authentication to proceed, or `false` to reject the request

**Important**: The hook runs **only once** per user - when their account is first created. It does not run on subsequent authentications for existing accounts.

## Use Cases

Since the hook only runs once when an account is first created, it's perfect for:

- **Initialize default data** for new users (create default todo lists, settings, etc.)
- **Send welcome emails** or notifications to new users
- **Set up user-specific configurations** and initial preferences
- **Sync initial user data** from external systems
- **Validate new account creation** and potentially reject it by returning `false`

## Example

```typescript
import { CmsModule } from '@trailmix-cms/cms';
import * as models from './models';

@Module({
    imports: [
        CmsModule.forRoot({
            // ... other config
            authGuardHook: async (account: models.Account.Entity) => {
                // This hook only runs when the account is first created
                // It will NOT run on subsequent authentications for this user
                
                // Create default todo list for new users
                await todoListCollection.insertOne({
                    name: 'My Todos',
                }, {
                    system: false,
                    anonymous: false,
                    account_id: account._id,
                });
                
                // Send welcome email to new user
                await emailService.sendWelcomeEmail(account.user_id);
                
                // Validate account status (optional)
                // Return false to reject account creation
                if (account.suspended) {
                    return false; // Reject authentication
                }
                
                return true; // Allow authentication to proceed
            },
        }),
    ],
})
export class AppModule {}
```

## Important Notes

- The hook runs **only once** per user - when their account is first created
- It does **not** run on subsequent authentications for existing accounts
- The hook runs **synchronously** during the authentication flow
- Keep operations fast to avoid delaying user login
- For heavy operations, consider queuing them for background processing
- Returning `false` will reject the authentication request with a 500 error
- The hook receives the account entity that was just created

## Configuration

The `authGuardHook` is configured in the `CmsModule.forRoot()` options:

```typescript
CmsModule.forRoot({
    authGuardHook: async (account: AccountEntity) => {
        // Your custom logic here
        return true; // or false to reject
    },
})
```

If no hook is provided, the default behavior is to always return `true`, allowing authentication to proceed.

## Next Steps

- Learn about [Database Models](./database-models.md)
- Set up [Database Collections](./database-collections.md)
- See [Configuration](./configuration.md) for other CMS setup options
